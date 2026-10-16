import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ProfilePage from "./page";

afterEach(cleanup);

describe("ProfilePage", () => {
  it("renders the profile details and activity sections", () => {
    render(<ProfilePage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Profile" })).toBeInTheDocument();
  });
});
