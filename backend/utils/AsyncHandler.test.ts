import { describe, expect, it, vi } from "vitest";
import asyncHandler from "./AsyncHandler.ts";

describe("asyncHandler", () => {
  it("forwards rejected handler promises to next", async () => {
    const failure = new Error("request failed");
    const next = vi.fn();
    const handler = asyncHandler(() => Promise.reject(failure));

    await handler({} as never, {} as never, next);

    expect(next).toHaveBeenCalledWith(failure);
  });
});
