import { describe, expect, it, vi } from "vitest";
import ApiError from "../utils/ApiError.ts";
import notFoundMiddleware from "./notFound.middleware.ts";

describe("notFoundMiddleware", () => {
  it("forwards a 404 ApiError containing the requested URL", () => {
    const next = vi.fn();

    notFoundMiddleware(
      { originalUrl: "/api/missing" } as never,
      {} as never,
      next,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0]).toMatchObject({
      statusCode: 404,
      message: "Route '/api/missing' not found.",
    });
  });
});
