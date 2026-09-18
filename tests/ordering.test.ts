import { describe, expect, it } from "vitest";
import { nextOrder, reorderById } from "@/lib/order";

describe("content ordering", () => {
  it("assigns the next order after the current maximum", () => {
    expect(nextOrder(4)).toBe(5);
    expect(nextOrder(0)).toBe(1);
  });

  it("starts ordering at zero when there are no existing items", () => {
    expect(nextOrder(null)).toBe(0);
    expect(nextOrder(undefined)).toBe(0);
  });

  it("moves an item up or down without mutating the source list", () => {
    const items = [{ id: "one" }, { id: "two" }, { id: "three" }];

    expect(reorderById(items, "two", "up")?.map((item) => item.id)).toEqual([
      "two",
      "one",
      "three",
    ]);
    expect(reorderById(items, "two", "down")?.map((item) => item.id)).toEqual([
      "one",
      "three",
      "two",
    ]);
    expect(items.map((item) => item.id)).toEqual(["one", "two", "three"]);
  });

  it("does not reorder when the item is missing or already at the boundary", () => {
    const items = [{ id: "one" }, { id: "two" }];

    expect(reorderById(items, "one", "up")).toBeNull();
    expect(reorderById(items, "two", "down")).toBeNull();
    expect(reorderById(items, "missing", "up")).toBeNull();
  });
});
