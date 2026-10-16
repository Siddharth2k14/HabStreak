import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ChangeBackground from "./ChangeBackground";

afterEach(cleanup);

describe("ChangeBackground", () => {
  it("rejects files that are not supported image types", () => {
    const { container } = render(<ChangeBackground />);
    const fileInput = container.querySelector('input[type="file"]');

    expect(screen.getByRole("heading", { name: "Change Background" })).toBeInTheDocument();
    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, {
      target: { files: [new File(["text"], "notes.txt", { type: "text/plain" })] },
    });

    expect(screen.getByText("Only PNG, JPG, JPEG, and WebP images are allowed.")).toBeInTheDocument();
  });
});
