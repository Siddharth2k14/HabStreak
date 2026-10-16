import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("../TaskBoard/page", () => ({
  TaskBoard: () => <h2>Task board content</h2>,
}));

afterEach(cleanup);

describe("Task dashboard", () => {
  it("renders the task board in the dashboard layout", () => {
    render(<Dashboard />);

    expect(screen.getByText("Task board content")).toBeInTheDocument();
  });
});
