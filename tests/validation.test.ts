import { describe, expect, it } from "vitest";
import { databaseIdSchema } from "@/lib/validation";

describe("database ID validation", () => {
  it("accepts UUIDs used by persisted content", () => {
    expect(
      databaseIdSchema.safeParse("11000000-0000-0000-0000-000000000001")
        .success,
    ).toBe(true);
    expect(
      databaseIdSchema.safeParse("A1000000-0000-0000-0000-000000000001")
        .success,
    ).toBe(true);
  });

  it("rejects malformed or empty IDs", () => {
    for (const value of ["", "not-an-id", "11000000-0000-0000-0000"]) {
      expect(databaseIdSchema.safeParse(value).success).toBe(false);
    }
  });
});
