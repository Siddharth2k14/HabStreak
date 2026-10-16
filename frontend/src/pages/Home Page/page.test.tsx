import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./page";

afterEach(cleanup);

describe("HomePage", () => {
  it("renders the application shell around its nested route", () => {
    render(
      <MemoryRouter initialEntries={["/home-page/dashboard"]}>
        <Routes>
          <Route path="/home-page" element={<HomePage />}>
            <Route path="dashboard" element={<p>Dashboard view</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "HabStreak" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByText("Dashboard view")).toBeInTheDocument();
  });
});
