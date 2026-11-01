import { describe, expect, it } from "vitest";

import { ensureLeadingSlash, joinUrl, stripTrailingSlash, toAbsoluteUrl } from "./url";

describe("URL Utilities", () => {
  describe("stripTrailingSlash", () => {
    it("removes single trailing slash", () => {
      expect(stripTrailingSlash("https://example.com/")).toBe("https://example.com");
    });

    it("removes multiple trailing slashes", () => {
      expect(stripTrailingSlash("https://example.com///")).toBe("https://example.com");
    });

    it("returns empty string for null input", () => {
      expect(stripTrailingSlash(null)).toBe("");
    });

    it("returns empty string for undefined input", () => {
      expect(stripTrailingSlash(undefined)).toBe("");
    });

    it("returns empty string for empty string input", () => {
      expect(stripTrailingSlash("")).toBe("");
    });

    it("leaves URLs without trailing slashes unchanged", () => {
      expect(stripTrailingSlash("https://example.com")).toBe("https://example.com");
      expect(stripTrailingSlash("https://example.com/path")).toBe("https://example.com/path");
    });
  });

  describe("ensureLeadingSlash", () => {
    it("adds leading slash when missing", () => {
      expect(ensureLeadingSlash("path")).toBe("/path");
    });

    it("keeps single leading slash", () => {
      expect(ensureLeadingSlash("/path")).toBe("/path");
    });

    it("removes multiple leading slashes and keeps only one", () => {
      expect(ensureLeadingSlash("///path")).toBe("/path");
    });

    it("returns empty string for null input", () => {
      expect(ensureLeadingSlash(null)).toBe("");
    });

    it("returns empty string for undefined input", () => {
      expect(ensureLeadingSlash(undefined)).toBe("");
    });

    it("returns empty string for empty string input", () => {
      expect(ensureLeadingSlash("")).toBe("");
    });

    it("handles complex paths correctly", () => {
      expect(ensureLeadingSlash("api/users/123")).toBe("/api/users/123");
      expect(ensureLeadingSlash("/api/users/123")).toBe("/api/users/123");
    });
  });

  describe("joinUrl", () => {
    it("joins base URL and path correctly", () => {
      expect(joinUrl("https://example.com", "api/users")).toBe("https://example.com/api/users");
    });

    it("handles trailing slash in base URL", () => {
      expect(joinUrl("https://example.com/", "api/users")).toBe("https://example.com/api/users");
    });

    it("handles leading slash in path", () => {
      expect(joinUrl("https://example.com", "/api/users")).toBe("https://example.com/api/users");
    });

    it("handles both trailing and leading slashes", () => {
      expect(joinUrl("https://example.com/", "/api/users")).toBe("https://example.com/api/users");
    });

    it("handles multiple slashes", () => {
      expect(joinUrl("https://example.com///", "///api/users")).toBe(
        "https://example.com/api/users",
      );
    });

    it("handles null/undefined base", () => {
      expect(joinUrl(null, "api/users")).toBe("/api/users");
      expect(joinUrl(undefined, "api/users")).toBe("/api/users");
    });

    it("handles null/undefined path", () => {
      expect(joinUrl("https://example.com", null)).toBe("https://example.com");
      expect(joinUrl("https://example.com", undefined)).toBe("https://example.com");
    });

    it("handles both null/undefined", () => {
      expect(joinUrl(null, null)).toBe("");
      expect(joinUrl(undefined, undefined)).toBe("");
    });

    it("handles empty strings", () => {
      expect(joinUrl("", "api/users")).toBe("/api/users");
      expect(joinUrl("https://example.com", "")).toBe("https://example.com");
      expect(joinUrl("", "")).toBe("");
    });
  });

  describe("toAbsoluteUrl", () => {
    it("returns absolute URLs unchanged", () => {
      expect(toAbsoluteUrl("https://example.com", "https://other.com/path")).toBe(
        "https://other.com/path",
      );
      expect(toAbsoluteUrl("https://example.com", "http://other.com/path")).toBe(
        "http://other.com/path",
      );
    });

    it("converts relative URLs to absolute", () => {
      expect(toAbsoluteUrl("https://example.com", "api/users")).toBe(
        "https://example.com/api/users",
      );
      expect(toAbsoluteUrl("https://example.com", "/api/users")).toBe(
        "https://example.com/api/users",
      );
    });

    it("handles case-insensitive protocol detection", () => {
      expect(toAbsoluteUrl("https://example.com", "HTTPS://other.com/path")).toBe(
        "HTTPS://other.com/path",
      );
      expect(toAbsoluteUrl("https://example.com", "HTTP://other.com/path")).toBe(
        "HTTP://other.com/path",
      );
    });

    it("handles null/undefined base", () => {
      expect(toAbsoluteUrl(null, "api/users")).toBe("/api/users");
      expect(toAbsoluteUrl(undefined, "api/users")).toBe("/api/users");
    });

    it("handles complex scenarios", () => {
      expect(toAbsoluteUrl("https://api.example.com/", "/v1/users/123")).toBe(
        "https://api.example.com/v1/users/123",
      );
      expect(toAbsoluteUrl("https://api.example.com", "https://cdn.example.com/image.jpg")).toBe(
        "https://cdn.example.com/image.jpg",
      );
    });
  });
});
