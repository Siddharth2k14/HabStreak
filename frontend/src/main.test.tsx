import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRender, mockCreateRoot } = vi.hoisted(() => {
  const mockRender = vi.fn();
  const mockCreateRoot = vi.fn(() => ({ render: mockRender }));
  return { mockRender, mockCreateRoot };
});

vi.mock("react-dom/client", () => ({ createRoot: mockCreateRoot }));
vi.mock("./App.tsx", () => ({ default: () => null }));
vi.mock("./context/AuthContext.tsx", () => ({ AuthProvider: () => null }));

import { createRoot } from "react-dom/client";

describe("main entry point", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it("mounts the application into the root element", async () => {
    await import("./main");

    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(mockRender).toHaveBeenCalledOnce();
  }, 15000);
});
