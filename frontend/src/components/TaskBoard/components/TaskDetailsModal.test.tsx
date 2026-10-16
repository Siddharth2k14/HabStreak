import { describe, expect, it } from "vitest";

describe("TaskDetailsModal module", () => {
  it("can be imported", async () => {
    await expect(import("./TaskDetailsModal")).resolves.toBeDefined();
  });
});
