import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TaskBoardHeader } from "./TaskBoardHeader";

afterEach(cleanup);

describe("TaskBoardHeader", () => {
  it("shows the board title and task creation action", () => {
    render(<TaskBoardHeader onTaskCreated={vi.fn()} />);

    expect(screen.getByText("Task Board")).toBeInTheDocument();
    expect(screen.getByText("Organize your tasks and track their progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument();
  });
});
