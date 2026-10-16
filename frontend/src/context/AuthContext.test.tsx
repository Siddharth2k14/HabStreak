import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../services/auth.service.ts", () => ({
  loginRequest: vi.fn(),
  logoutRequest: vi.fn(),
  refreshRequest: vi.fn().mockResolvedValue({
    success: true,
    message: "Refreshed",
    accessToken: "test-token",
    user: { id: "user-1", username: "tester", email: "tester@example.com" },
  }),
}));

const AuthStatus = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  return <p>{`${user?.username ?? "anonymous"}|${isAuthenticated}|${isLoading}`}</p>;
};

afterEach(cleanup);

describe("AuthProvider", () => {
  it("initializes authentication from a refreshed session", async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("tester|true|false")).toBeInTheDocument();
    });
  });
});
