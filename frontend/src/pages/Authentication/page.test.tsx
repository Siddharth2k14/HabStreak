import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Authentication } from "./page";

vi.mock("../../components/Login/page", () => ({
  Login: () => <p>Login screen</p>,
}));

vi.mock("../../components/Register/page", () => ({
  Register: () => <p>Registration screen</p>,
}));

afterEach(cleanup);

describe("Authentication", () => {
  it("renders the login route", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Authentication />
      </MemoryRouter>,
    );

    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });
});
