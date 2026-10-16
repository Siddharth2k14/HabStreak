import { describe, expect, it } from "vitest";
import ApiError from "./ApiError.ts";

describe("ApiError", () => {
  it("retains its HTTP status and message as an Error", () => {
    const error = new ApiError(422, "Invalid input.");

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("Error");
    expect(error.statusCode).toBe(422);
    expect(error.message).toBe("Invalid input.");
  });
});
