import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TaskColumn } from "./TaskColumn";

afterEach(cleanup);

describe("TaskColumn", () => {
  it("shows the status, task count, and empty-state prompt", () => {
    render(
      <TaskColumn
        status="TODO"
        tasks={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("TODO")).toBeInTheDocument();
    expect(screen.getByText("Drop task here")).toBeInTheDocument();
  });
});
