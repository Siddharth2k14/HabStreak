import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Profile from "./Profile";

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

afterEach(() => {
  cleanup();
  mockNavigate.mockClear();
});

describe("Profile", () => {
  it("provides profile and settings navigation actions", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/profile-page");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/settings");
  });
});
