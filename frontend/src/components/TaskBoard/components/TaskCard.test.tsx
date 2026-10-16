import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task.types";

const task: Task = {
  id: "task-1",
  title: "Read a book",
  description: "Read for twenty minutes",
  priority: "HIGH",
  dueDate: null,
  status: "TODO",
  position: 1,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

afterEach(cleanup);

describe("TaskCard", () => {
  it("shows the task details and offers its actions", () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Read a book")).toBeInTheDocument();
    expect(screen.getByText("Read for twenty minutes")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actions for Read a book" }));
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByText("Delete task")).toBeInTheDocument();
  });
});
