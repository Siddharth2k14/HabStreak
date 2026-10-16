import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateLogger, mockConsole, mockFile } = vi.hoisted(() => ({
  mockCreateLogger: vi.fn(() => ({ info: vi.fn(), error: vi.fn() })),
  mockConsole: vi.fn(function (this: object) {
    Object.assign(this, { kind: "console" });
  }),
  mockFile: vi.fn(function (this: object, options: unknown) {
    Object.assign(this, { kind: "file", options });
  }),
}));

vi.mock("winston", () => ({
  createLogger: mockCreateLogger,
  format: {
    combine: vi.fn((...formats) => formats),
    timestamp: vi.fn((options) => ({ timestamp: options })),
    errors: vi.fn((options) => ({ errors: options })),
    printf: vi.fn((formatter) => ({ formatter })),
  },
  transports: { Console: mockConsole, File: mockFile },
}));

describe("logger", () => {
  beforeEach(() => vi.clearAllMocks());

  it("configures console output and separate error and combined log files", async () => {
    await import("./logger.ts");

    expect(mockConsole).toHaveBeenCalledOnce();
    expect(mockFile).toHaveBeenCalledWith({ filename: "logs/error.log", level: "error" });
    expect(mockFile).toHaveBeenCalledWith({ filename: "logs/combined.log" });
    expect(mockCreateLogger).toHaveBeenCalledOnce();
  });
});
