import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CurrentStreak, LongestStreak } from "./AnalyticsHeader";

afterEach(cleanup);

describe("AnalyticsHeader", () => {
  it("renders the current and longest streak summaries", () => {
    render(
      <>
        <CurrentStreak />
        <LongestStreak />
      </>,
    );

    expect(screen.getByText("Current Streak")).toBeInTheDocument();
    expect(screen.getByText("Longest Streak")).toBeInTheDocument();
    expect(screen.getAllByText("123")).toHaveLength(2);
  });
});
