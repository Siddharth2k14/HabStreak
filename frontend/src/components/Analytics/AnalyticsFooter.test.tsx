import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AnalyticsFooter from "./AnalyticsFooter";

afterEach(cleanup);

describe("AnalyticsFooter", () => {
  it("shows the completed, pending, and overdue task totals", () => {
    render(<AnalyticsFooter />);

    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
    expect(screen.getByText("Pending Tasks")).toBeInTheDocument();
    expect(screen.getByText("Over Due Tasks")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(3);
  });
});
