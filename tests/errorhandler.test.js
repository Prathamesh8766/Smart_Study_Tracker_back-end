import { jest } from "@jest/globals";
import errorHandler from "../src/middleware/errorHandler.js";

describe("errorHandler middleware", () => {
  const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("handles generic error", () => {
    const req = {};
    const res = createRes();

    errorHandler(new Error("Boom"), req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: "Boom", statusCode: 500 })
    );
  });

  test("handles CastError", () => {
    const res = createRes();
    errorHandler({ name: "CastError" }, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Resource not found", statusCode: 404 })
    );
  });

  test("handles duplicate key error", () => {
    const res = createRes();
    errorHandler({ code: 11000, keyValue: { email: "x@mail.com" } }, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "email already exists", statusCode: 400 })
    );
  });

  test("handles validation error", () => {
    const res = createRes();
    errorHandler(
      {
        name: "ValidationError",
        errors: {
          email: { message: "Email is required" },
          password: { message: "Password is too short" },
        },
      },
      {},
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Email is required, Password is too short",
        statusCode: 400,
      })
    );
  });

  test("handles JWT errors", () => {
    const res1 = createRes();
    errorHandler({ name: "JsonWebTokenError" }, {}, res1, jest.fn());
    expect(res1.status).toHaveBeenCalledWith(401);

    const res2 = createRes();
    errorHandler({ name: "TokenExpiredError" }, {}, res2, jest.fn());
    expect(res2.status).toHaveBeenCalledWith(401);
    expect(res2.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Token expired", statusCode: 401 })
    );
  });
});