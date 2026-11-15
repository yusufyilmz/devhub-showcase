import { timingSafeEqual } from "node:crypto";

import { sql } from "drizzle-orm";
import { z } from "zod";

import { stableNotificationId } from "@shared/notifications";
import {
  createPushSender,
  deliverQueuedNotifications,
  validatePushSubscription,
} from "@shared/notifications/server";

import { database } from "../../db/client";
import {
  cleanNotifications,
  disableDevice,
  enqueueReminder,
  fitnessDeliveryQueue,
  notificationAccountIds,
  saveDevice,
} from "../../repositories/notifications/index";
import { WorkspaceRepository } from "../workspace/index";
import { dueFitnessReminders } from "./reminders";

type FitnessNotificationServiceDependencies = {
  configuration: () => {
    publicKey?: string;
    privateKey?: string;
    subject?: string;
    cronSecret?: string;
  };
  identify: (request: Request) => Promise<string | null>;
  sameOrigin: (request: Request) => boolean;
};

const headers = { "Cache-Control": "private, no-store" };
class AccessDenied extends Error {}

class FitnessNotificationService {
  constructor(private readonly dependencies: FitnessNotificationServiceDependencies) {}

  pushConfiguration() {
    const publicKey = this.dependencies.configuration().publicKey;
    const privateKey = this.dependencies.configuration().privateKey;
    const subject = this.dependencies.configuration().subject;
    return publicKey && privateKey && subject ? { privateKey, publicKey, subject } : null;
  }

  async accountId(request: Request) {
    const id = await this.dependencies.identify(request);
    if (!id) throw new AccessDenied();
    return id;
  }

  async notificationRequest(request: Request) {
    if (request.method !== "GET" && !this.dependencies.sameOrigin(request))
      return new Response(null, { headers, status: 403 });
    try {
      const user = await this.accountId(request);
      const config = this.pushConfiguration();
      if (request.method === "GET") {
        const rows = await database().execute(
          sql`select revision from public.task_workspaces where user_id=${user}::uuid`,
        );
        return Response.json(
          {
            configured: Boolean(config),
            publicKey: config?.publicKey ?? null,
            revision: Number(rows[0]?.revision ?? -1),
          },
          { headers },
        );
      }
      const text = await request.text();
      if (text.length > 8192) return new Response(null, { headers, status: 413 });
      const value: unknown = JSON.parse(text);
      if (request.method === "DELETE") {
        const input = z
          .object({ endpoint: z.url().max(2048) })
          .strict()
          .parse(value);
        await disableDevice(user, input.endpoint);
      } else {
        if (!config)
          return Response.json(
            { error: "Background reminders are not configured yet." },
            { headers, status: 503 },
          );
        const input = z.object({ subscription: z.unknown() }).strict().parse(value);
        await saveDevice(user, validatePushSubscription(input.subscription));
      }
      return Response.json({ ok: true }, { headers });
    } catch (error) {
      return this.notificationFailure(error);
    }
  }

  notificationFailure(error: unknown) {
    const status =
      error instanceof AccessDenied
        ? 403
        : error instanceof z.ZodError || error instanceof SyntaxError
          ? 400
          : 503;
    return Response.json(
      {
        error:
          status === 403
            ? "Sign in with a confirmed account."
            : "Could not save this device's notification settings.",
      },
      { headers, status },
    );
  }

  async testNotification(request: Request) {
    if (!this.dependencies.sameOrigin(request)) return new Response(null, { headers, status: 403 });
    try {
      const user = await this.accountId(request);
      const config = this.pushConfiguration();
      if (!config) throw new Error("setup");
      const input = z
        .object({ endpoint: z.url().max(2048) })
        .strict()
        .parse(await request.json());
      // One logical test/device/minute; only this owner's registered device is targeted.
      const key = await stableNotificationId(
        `test:${user}:${input.endpoint}:${Math.floor(Date.now() / 60000)}`,
      );
      await enqueueReminder(
        user,
        key,
        {
          body: "Notifications are working on this device.",
          id: key,
          title: "My Fitness Studio",
          url: "/?view=More",
        },
        input.endpoint,
      );
      const result = await deliverQueuedNotifications(
        fitnessDeliveryQueue(user, key),
        createPushSender(config),
        10,
      );
      return Response.json(
        result.sent > 0
          ? result
          : {
              error:
                "No test was delivered. Wait a minute before retrying, and check this device's subscription.",
            },
        { headers, status: result.sent > 0 ? 200 : 503 },
      );
    } catch (error) {
      return Response.json(
        { error: "Could not send the test notification." },
        { headers, status: error instanceof AccessDenied ? 403 : 503 },
      );
    }
  }

  authorizedWorker(request: Request) {
    const secret = this.dependencies.configuration().cronSecret;
    if (!secret || secret.length < 32) return false;
    const expected = Buffer.from(`Bearer ${secret}`);
    const received = Buffer.from(request.headers.get("authorization") ?? "");
    return expected.length === received.length && timingSafeEqual(expected, received);
  }

  async dispatchReminders(request: Request) {
    if (!this.authorizedWorker(request)) return new Response(null, { headers, status: 403 });
    try {
      const config = this.pushConfiguration();
      if (!config) throw new Error("setup");
      const accounts = await notificationAccountIds();
      const repository = new WorkspaceRepository(database());
      const sender = createPushSender(config);
      const totals = { expired: 0, failed: 0, processed: 0, retry: 0, sent: 0 };
      let failedAccounts = 0;
      for (let offset = 0; offset < accounts.length; offset += 4) {
        const results = await Promise.allSettled(
          accounts
            .slice(offset, offset + 4)
            .map((user) => this.dispatchAccount(user, repository, sender)),
        );
        for (const result of results) {
          if (result.status === "rejected") {
            failedAccounts++;
            continue;
          }
          for (const key of Object.keys(totals) as (keyof typeof totals)[])
            totals[key] += result.value[key];
        }
      }
      return Response.json(
        { ...totals, failedAccounts },
        { headers, status: failedAccounts ? 503 : 200 },
      );
    } catch {
      return Response.json(
        { error: "Reminder delivery is unavailable." },
        { headers, status: 503 },
      );
    }
  }

  async dispatchAccount(
    user: string,
    repository: WorkspaceRepository,
    sender: ReturnType<typeof createPushSender>,
  ) {
    const snapshot = await repository.find(user);
    if (snapshot) {
      for (const reminder of dueFitnessReminders(snapshot.state)) {
        const key = await stableNotificationId(`fitness-os:${reminder.key}`);
        await enqueueReminder(
          user,
          key,
          {
            body: "You have a task due. Open the app to see it.",
            id: key,
            title: "My Fitness Studio reminder",
            url: reminder.url,
          },
          undefined,
          snapshot.revision,
        );
      }
    }
    await cleanNotifications(user);
    return deliverQueuedNotifications(fitnessDeliveryQueue(user), sender, 10);
  }
}

export function createFitnessNotificationHandlers(
  dependencies: FitnessNotificationServiceDependencies,
) {
  const service = new FitnessNotificationService(dependencies);
  return {
    dispatchReminders: service.dispatchReminders.bind(service),
    notificationRequest: service.notificationRequest.bind(service),
    pushConfiguration: service.pushConfiguration.bind(service),
    testNotification: service.testNotification.bind(service),
  };
}
