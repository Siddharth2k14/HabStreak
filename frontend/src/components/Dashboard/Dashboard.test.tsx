import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("../TaskBoard/services/task.service.ts", () => ({
  getTasks: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../services/auth.service.ts", () => ({
  getUser: vi.fn().mockResolvedValue({ username: "tester" }),
}));

afterEach(cleanup);

describe("Dashboard", () => {
  it("loads the user's dashboard overview", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByText("QUICK OVERVIEW")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("WELCOME, TESTER")).toBeInTheDocument();
    });
    expect(screen.getByText("No recent activity yet.")).toBeInTheDocument();
  });
});
