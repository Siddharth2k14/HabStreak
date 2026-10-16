import { describe, expect, it } from "vitest";

describe("CreateTaskModal module", () => {
  it("can be imported", async () => {
    await expect(import("./CreateTaskModal")).resolves.toBeDefined();
  });
});
