import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
}));
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: async () => ({
    auth: { getUser: mocks.getUser },
    from: () => ({ select: mocks.select }),
  }),
}));

import { OwnerEditLink } from "../apps/web/features/admin/owner-edit-link";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.select.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockReturnValue({ eq: mocks.eq, maybeSingle: mocks.maybeSingle });
});
it("shows no edit link for a visitor", async () => {
  mocks.getUser.mockResolvedValue({ data: { user: null } });
  expect(await OwnerEditLink({ username: "alice" })).toBeNull();
  expect(mocks.select).not.toHaveBeenCalled();
});
it("shows no edit link for another signed in user", async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "bob-id", email_confirmed_at: "today" } },
  });
  mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
  expect(await OwnerEditLink({ username: "alice" })).toBeNull();
  expect(mocks.eq).toHaveBeenCalledWith("owner_id", "bob-id");
  expect(mocks.eq).toHaveBeenCalledWith("username", "alice");
});
it("offers the owner their own edit page", async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "alice-id", email_confirmed_at: "today" } },
  });
  mocks.maybeSingle.mockResolvedValue({
    data: { id: "alice-profile" },
    error: null,
  });
  const link = await OwnerEditLink({ username: "alice" });
  expect(link?.props.children.props.href).toBe("/alice/edit");
});
