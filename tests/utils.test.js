import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import generateToken from "../src/utils/generateToken.js";

describe("generateToken", () => {
  afterEach(() => jest.restoreAllMocks());

  test("calls jwt.sign with configured secret and expiry", async () => {
    process.env.JWT_SECRET = "secret";
    process.env.JWT_EXPIRE = "1d";
    jest.spyOn(jwt, "sign").mockReturnValue("signed-token");

    const token = await generateToken("user-1");

    expect(jwt.sign).toHaveBeenCalledWith({ id: "user-1" }, "secret", { expiresIn: "1d" });
    expect(token).toBe("signed-token");
  });
});