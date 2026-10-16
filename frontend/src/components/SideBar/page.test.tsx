import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import SideBar from "./page";

afterEach(cleanup);

describe("SideBar", () => {
  it("renders navigation for the main application sections", () => {
    render(
      <MemoryRouter>
        <SideBar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Task Board" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Tasks" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Analytics" })).toBeInTheDocument();
  });
});
