import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import EmailVerified from "./EmailVerified";

afterEach(cleanup);

describe("EmailVerified", () => {
  it("confirms verification and links to login", () => {
    render(
      <MemoryRouter>
        <EmailVerified />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Email Verified Successfully" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Login" })).toHaveAttribute("href", "/auth/login");
  });
});
