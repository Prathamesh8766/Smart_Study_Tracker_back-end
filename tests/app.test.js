import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("app", () => {
  test("returns 404 for unknown route", async () => {
    const res = await request(app).get("/unknown-route");
    
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Route not Found");
  });
});