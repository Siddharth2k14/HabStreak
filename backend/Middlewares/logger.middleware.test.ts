import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";

const { info } = vi.hoisted(() => ({ info: vi.fn() }));
vi.mock("../utils/logger.ts", () => ({
  default: { info, error: vi.fn() },
}));

import loggerMiddleware from "./logger.middleware.ts";

describe("loggerMiddleware", () => {
  it("logs request details when the response finishes", () => {
    const response = new EventEmitter() as EventEmitter & { statusCode: number };
    response.statusCode = 204;
    const next = vi.fn();

    loggerMiddleware(
      { method: "GET", originalUrl: "/health", ip: "127.0.0.1" } as never,
      response as never,
      next,
    );
    response.emit("finish");

    expect(next).toHaveBeenCalledOnce();
    expect(info).toHaveBeenCalledWith(expect.stringMatching(
      /^GET \/health \| 204 \| \d+ ms \| IP: 127\.0\.0\.1$/,
    ));
  });
});
