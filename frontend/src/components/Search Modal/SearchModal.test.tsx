import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchModal } from "./SearchModal";

afterEach(cleanup);

describe("SearchModal", () => {
  it("renders the task search form and invokes its close callback", () => {
    const onClose = vi.fn();
    render(<SearchModal onClose={onClose} />);

    expect(screen.getByRole("heading", { name: "Search Task" })).toBeInTheDocument();
    expect(screen.getByLabelText("Task Name")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
