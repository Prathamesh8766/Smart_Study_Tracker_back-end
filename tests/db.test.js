import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";

describe("connectDB", () => {
    afterEach(() => jest.restoreAllMocks());

    test("connects successfully", async () => {
        jest.spyOn(mongoose, "connect").mockResolvedValue({ connection: { host: "localhost" } });
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => { });

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
        expect(logSpy).toHaveBeenCalled();
    });

    test("handles db error and exits", async () => {
        jest.spyOn(mongoose, "connect").mockRejectedValue(new Error("db down"));
        jest.spyOn(console, "error").mockImplementation(() => { });
        const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => { });

        await connectDB();

        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});