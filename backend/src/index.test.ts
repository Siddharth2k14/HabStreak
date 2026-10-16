import { beforeEach, describe, expect, it, vi } from "vitest";

const { app, expressMock, expressJson, listen, use, get } = vi.hoisted(() => {
  const use = vi.fn();
  const get = vi.fn();
  const listen = vi.fn();
  const app = { use, get, listen };
  const expressMock = Object.assign(vi.fn(() => app), {
    json: vi.fn(() => "json-parser"),
  });
  return { app, expressMock, expressJson: expressMock.json, listen, use, get };
});

vi.mock("express", () => ({ default: expressMock }));
vi.mock("cookie-parser", () => ({ default: vi.fn(() => "cookie-parser") }));
vi.mock("cors", () => ({ default: vi.fn(() => "cors-middleware") }));
vi.mock("../Middlewares/logger.middleware.ts", () => ({ default: vi.fn() }));
vi.mock("../Middlewares/error.middleware.ts", () => ({ default: vi.fn() }));
vi.mock("../Middlewares/notFound.middleware.ts", () => ({ default: vi.fn() }));
vi.mock("../Middlewares/auth.middlewares.ts", () => ({ default: vi.fn() }));
vi.mock("../Routes/User Routes/user.routes.ts", () => ({ default: "user-routes" }));
vi.mock("../Routes/Task Routes/task.routes.ts", () => ({ default: "task-routes" }));
vi.mock("../utils/logger.ts", () => ({ default: { info: vi.fn(), error: vi.fn() } }));

describe("server entry point", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("PORT", "4321");
    vi.stubEnv("FRONTEND_URL", "https://app.example.test");
  });

  it("configures middleware, mounts routes, and listens on the configured port", async () => {
    await import("./index.ts");

    expect(expressMock).toHaveBeenCalledOnce();
    expect(expressJson).toHaveBeenCalledOnce();
    expect(get).toHaveBeenCalledWith("/", expect.any(Function));
    expect(use).toHaveBeenCalledWith("/api/auth", "user-routes");
    expect(use).toHaveBeenCalledWith("/api/tasks", expect.any(Function), "task-routes");
    expect(listen).toHaveBeenCalledWith("4321", expect.any(Function));
  });
});
