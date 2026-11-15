import { env } from "@shared/env";
import type { ComponentLogger } from "@shared/utils/client-logger";

const readInitialFlag = () => {
  const envValue =
    env.NEXT_PUBLIC_CHAT_V2_DEBUG ??
    (typeof window === "undefined" ? env.CHAT_V2_DEBUG : undefined);

  if (typeof envValue === "string") {
    return envValue.toLowerCase() === "true";
  }

  if (typeof globalThis !== "undefined") {
    const globalFlag = (globalThis as { __CHAT_V2_DEBUG__?: boolean }).__CHAT_V2_DEBUG__;
    if (typeof globalFlag === "boolean") {
      return globalFlag;
    }
  }

  return false;
};

let debugEnabled = readInitialFlag();

export const isChatV2DebugEnabled = () => debugEnabled;

export const setChatV2DebugEnabled = (enabled: boolean) => {
  debugEnabled = enabled;
  if (typeof globalThis !== "undefined") {
    (globalThis as { __CHAT_V2_DEBUG__?: boolean }).__CHAT_V2_DEBUG__ = enabled;
  }
};

export const chatV2LogDebug = (
  logger: ComponentLogger,
  message: string,
  context?: Record<string, unknown>,
) => {
  if (!debugEnabled) return;
  if (context) {
    logger.debug(message, context);
  } else {
    logger.debug(message);
  }
};
