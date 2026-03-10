import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import User from "../src/models/User.js";
import protect from "../src/middleware/auth.js";
import { getprofile, login, register } from "../src/controllers/authController.js";

describe("auth controller and middleware", () => {

    const createRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("register returns 400 when user exists", async () => {

        jest.spyOn(User, "findOne").mockResolvedValue({ email: "a@mail.com" });
        const req = { body: { username: "a", email: "a@mail.com", password: "123456" } };
        const res = createRes();

        await register(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);

    });

    test("register creates a user and returns token", async () => {

        jest.spyOn(User, "findOne").mockResolvedValue(null);
        jest.spyOn(User, "create").mockResolvedValue({
            _id: "u1",
            username: "john",
            email: "john@mail.com",
            profileImage: "img.png",
            createdAt: new Date(),
        });

        process.env.JWT_SECRET = "secret";
        jest.spyOn(jwt, "sign").mockReturnValue("token-123");

        const res = createRes();
        await register(
            { body: { username: "john", email: "john@mail.com", password: "123456" } },
            res,
            jest.fn()
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, data: expect.objectContaining({ token: "token-123" }) })
        );

    });

    test("login validates input, user and password", async () => {

        const res = createRes();
        await login({ body: { email: "", password: "" } }, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);

        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
        const res2 = createRes();
        await login({ body: { email: "x@mail.com", password: "123" } }, res2, jest.fn());
        expect(res2.status).toHaveBeenCalledWith(400);

        const user = { matchPassword: jest.fn().mockResolvedValue(false) };
        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
        const res3 = createRes();
        await login({ body: { email: "x@mail.com", password: "123" } }, res3, jest.fn());
        expect(res3.status).toHaveBeenCalledWith(401);

    });

    test("login success and getprofile", async () => {

        const user = {
            _id: "u1",
            username: "john",
            email: "john@mail.com",
            createdAt: new Date(),
            matchPassword: jest.fn().mockResolvedValue(true),
        };

        jest.spyOn(User, "findOne").mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
        process.env.JWT_SECRET = "secret";
        jest.spyOn(jwt, "sign").mockReturnValue("token-ok");

        const res = createRes();
        await login({ body: { email: "john@mail.com", password: "123" } }, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(200);

        jest.spyOn(User, "findById").mockResolvedValue({ ...user, profileImage: "x", updatedAt: new Date() });
        const res2 = createRes();
        await getprofile({ user: { _id: "u1" } }, res2, jest.fn());
        expect(res2.status).toHaveBeenCalledWith(200);

    });

    test("protect handles no token, invalid token, expired token, no user and success", async () => {

        const next = jest.fn();

        const res = createRes();
        await protect({ headers: {} }, res, next);
        expect(res.status).toHaveBeenCalledWith(401);

        jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("bad");
        });

        const res2 = createRes();
        await protect({ headers: { authorization: "Bearer abc" } }, res2, next);
        expect(res2.status).toHaveBeenCalledWith(401);

        jwt.verify.mockImplementation(() => {
            const err = new Error("expired");
            err.name = "TokenExpiredError";
            throw err;
        });

        
        const res3 = createRes();
        await protect({ headers: { authorization: "Bearer abc" } }, res3, next);
        expect(res3.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Token has expired" }));

        jwt.verify.mockReturnValue({ id: "u1" });
        jest.spyOn(User, "findById").mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
        const res4 = createRes();
        await protect({ headers: { authorization: "Bearer abc" } }, res4, next);
        expect(res4.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User no longer exists" }));

        User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: "u1" }) });
        const req5 = { headers: { authorization: "Bearer abc" } };
        const res5 = createRes();
        await protect(req5, res5, next);
        expect(next).toHaveBeenCalled();
        expect(req5.user).toEqual({ _id: "u1" });

    });
});