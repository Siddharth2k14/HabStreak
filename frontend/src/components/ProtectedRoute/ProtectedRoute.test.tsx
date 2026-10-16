import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

afterEach(cleanup);

describe("ProtectedRoute", () => {
  it("redirects unauthenticated visitors to login", () => {
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private content</p>} />
          </Route>
          <Route path="/auth/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
  });
});
