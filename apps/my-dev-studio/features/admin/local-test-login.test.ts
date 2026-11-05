import { describe, expect, it } from "vitest";

import { localTestLoginEnabled } from "./local-test-login";

describe("local test login guard", () => {
  const base = {
    NODE_ENV: "development",
    LOCAL_TEST_LOGIN: "true",
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  } as NodeJS.ProcessEnv;

  it("accepts only explicitly enabled development with loopback Supabase", () => {
    expect(localTestLoginEnabled(base)).toBe(true);
    expect(localTestLoginEnabled({ ...base, NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321" })).toBe(true);
    expect(localTestLoginEnabled({ ...base, NODE_ENV: "production" })).toBe(false);
    expect(localTestLoginEnabled({ ...base, NODE_ENV: "test" })).toBe(false);
    expect(localTestLoginEnabled({ ...base, LOCAL_TEST_LOGIN: "false" })).toBe(false);
    expect(localTestLoginEnabled({ ...base, NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co" })).toBe(false);
    expect(localTestLoginEnabled({ ...base, NEXT_PUBLIC_SUPABASE_URL: "http://localhost.evil.example" })).toBe(false);
    expect(localTestLoginEnabled({ ...base, NEXT_PUBLIC_SUPABASE_URL: "not a url" })).toBe(false);
  });
});
