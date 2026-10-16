import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ChangePassword from "./ChangePassword";

afterEach(cleanup);

describe("ChangePassword", () => {
  it("renders all account and password fields", () => {
    render(<ChangePassword />);

    expect(screen.getByRole("heading", { name: "Change Password" })).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirm New Password")).toHaveAttribute("type", "password");
  });
});
