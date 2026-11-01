import { afterEach, describe, expect, it, vi } from "vitest";

import { supabaseConfig, supabaseConfigured } from ".";

describe("SupabaseConfig", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("prefers a publishable key over the legacy anon key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy");
    expect(supabaseConfig()).toEqual({
      key: "publishable",
      url: "https://example.supabase.co",
    });
  });
  it("retains compatibility with existing anon-key deployments", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy");
    expect(supabaseConfig().key).toBe("legacy");
  });
  it("reports when public Supabase env vars are present", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable");
    expect(supabaseConfigured()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy");
    expect(supabaseConfigured()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(supabaseConfigured()).toBe(false);
  });

  it("rejects missing configuration without leaking secrets", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "private-test-value");
    expect(() => supabaseConfig()).toThrow("Supabase is not configured.");
  });
});
