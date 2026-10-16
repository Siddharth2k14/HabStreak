import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CreateModal } from "./CreateModal";

afterEach(cleanup);

describe("CreateModal", () => {
  it("renders the task form inside a dialog", () => {
    const { container } = render(<CreateModal />);
    const dialog = container.querySelector("dialog");

    expect(dialog).toBeInTheDocument();
    expect(dialog?.querySelector("h1")).toHaveTextContent("Create Task");
    expect(dialog?.querySelector("#title")).toBeInTheDocument();
    expect(dialog?.querySelector("#description")).toBeInTheDocument();
  });
});
