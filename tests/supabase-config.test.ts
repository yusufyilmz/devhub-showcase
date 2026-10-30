import { afterEach, expect, it, vi } from "vitest";
import { supabaseConfig } from "../packages/lib/src/supabase/config";

afterEach(() => vi.unstubAllEnvs());
it("prefers a publishable key over the legacy anon key", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy");
  expect(supabaseConfig()).toEqual({
    url: "https://example.supabase.co",
    key: "publishable",
  });
});
it("retains compatibility with existing anon-key deployments", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy");
  expect(supabaseConfig().key).toBe("legacy");
});
it("rejects missing configuration without leaking secrets", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "private-test-value");
  expect(() => supabaseConfig()).toThrow("Supabase is not configured.");
});
