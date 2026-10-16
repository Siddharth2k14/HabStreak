import { beforeEach, describe, expect, it, vi } from "vitest";
import ApiError from "../utils/ApiError.ts";

const { loggerError } = vi.hoisted(() => ({ loggerError: vi.fn() }));
vi.mock("../utils/logger.ts", () => ({
  default: { error: loggerError, info: vi.fn() },
}));

import errorMiddleware from "./error.middleware.ts";

describe("errorMiddleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("preserves status and message from an ApiError", () => {
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    errorMiddleware(new ApiError(403, "Forbidden."), {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Forbidden." });
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("returns a generic 500 response for unexpected errors", () => {
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    errorMiddleware(new Error("internal details"), {} as never, response as never, vi.fn());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error.",
    });
  });
});
