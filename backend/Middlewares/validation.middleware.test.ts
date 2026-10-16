import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import validate from "./validation.middleware.ts";

describe("validation middleware", () => {
  const schema = z.object({
    body: z.object({ name: z.string().min(1) }),
    params: z.object({}),
    query: z.object({}),
  });

  it("continues when request data is valid", () => {
    const next = vi.fn();
    validate(schema)(
      { body: { name: "Taylor" }, params: {}, query: {} } as never,
      {} as never,
      next,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("returns a structured 400 response for invalid request data", () => {
    const next = vi.fn();
    const response = { status: vi.fn(), json: vi.fn() };
    response.status.mockReturnValue(response);

    validate(schema)(
      { body: { name: "" }, params: {}, query: {} } as never,
      response as never,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Validation failed.",
      errors: expect.arrayContaining([
        expect.objectContaining({ field: "body.name" }),
      ]),
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
