// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ load: vi.fn(), request: vi.fn() }));
vi.mock("@shared/auth/google-consent", () => ({
  loadGoogleConsent: mocks.load,
  requestGoogleProfileConsent: mocks.request,
}));

import { GoogleImportEditor } from "../apps/web/features/admin/google-import-editor";
import { profile } from "../packages/content/src/index";

const review = {
  notes: [],
  suggestions: [
    { field: "name", value: "Alex Morgan" },
    { field: "birthDate", value: "1990-02-10" },
  ],
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.load.mockResolvedValue({});
  mocks.request.mockImplementation((_oauth, options) =>
    options.onToken("ephemeral-token", ["basic", "birthday"]),
  );
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url, options) =>
      Response.json(
        options?.method === "POST"
          ? review
          : { clientId: "123-sample.apps.googleusercontent.com", enabled: true },
      ),
    ),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function consent() {
  await waitFor(() =>
    expect(screen.getByLabelText("Birthdate (optional)").hasAttribute("disabled")).toBe(false),
  );
  fireEvent.click(screen.getByLabelText("Birthdate (optional)"));
  fireEvent.click(
    screen.getByLabelText("Let MyDevStudio read my selected Google profile details for review."),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Read selected Google details" }).hasAttribute("disabled"),
    ).toBe(false),
  );
  fireEvent.click(screen.getByRole("button", { name: "Read selected Google details" }));
}
it("requires consent, reviews every field and applies only checked fields to the draft", async () => {
  const change = vi.fn();
  render(<GoogleImportEditor onChange={change} profile={profile} />);
  expect(mocks.load).not.toHaveBeenCalled();
  expect(mocks.request).not.toHaveBeenCalled();
  expect((screen.getByLabelText("Birthdate (optional)") as HTMLInputElement).checked).toBe(false);
  await consent();
  await screen.findByText("Review Google profile details");
  expect(change).not.toHaveBeenCalled();
  const apply = screen.getByRole("button", { name: "Apply selected Google details to draft" });
  expect(apply.hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByLabelText("Replace Full name"));
  fireEvent.click(apply);
  expect(change.mock.calls[0]?.[0].name).toBe("Alex Morgan");
  expect(change.mock.calls[0]?.[0].birthDate).toBeUndefined();
  expect(change.mock.calls[0]?.[0].phone).toBe(profile.phone);
  expect(screen.getByText(/Applied selected details to your draft/)).toBeTruthy();
  const calls = vi.mocked(fetch).mock.calls;
  expect(calls.filter(([, options]) => options?.method === "POST")).toHaveLength(1);
  expect(calls.every(([url]) => url === "/api/admin/google-profile")).toBe(true);
  expect(localStorage.getItem("ephemeral-token")).toBeNull();
});
it("ignores a late Google response after cancellation and never opens consent for managed profiles", async () => {
  const change = vi.fn();
  let callback: ((token: string, categories: string[]) => void) | undefined;
  mocks.request.mockImplementation((_oauth, options) => {
    callback = options.onToken;
  });
  const view = render(<GoogleImportEditor onChange={change} profile={profile} />);
  await consent();
  fireEvent.click(screen.getByRole("button", { name: "Cancel Google import" }));
  callback?.("ephemeral-token", ["basic"]);
  expect(
    vi.mocked(fetch).mock.calls.filter(([, options]) => options?.method === "POST"),
  ).toHaveLength(0);
  expect(change).not.toHaveBeenCalled();
  view.unmount();
  vi.mocked(fetch).mockClear();
  render(<GoogleImportEditor managed onChange={change} profile={profile} />);
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Read selected Google details" })).toBeNull();
});
