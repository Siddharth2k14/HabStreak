import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TaskBoard } from "./page";

vi.mock("./services/task.service.ts", () => ({
  getTasks: vi.fn().mockResolvedValue([]),
  moveTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

afterEach(cleanup);

describe("TaskBoard", () => {
  it("loads an empty board with all task status columns", async () => {
    render(<TaskBoard />);

    await waitFor(() => {
      expect(screen.getByText("Task Board")).toBeInTheDocument();
    });
    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("DOING")).toBeInTheDocument();
    expect(screen.getByText("IN REVIEW")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });
});
