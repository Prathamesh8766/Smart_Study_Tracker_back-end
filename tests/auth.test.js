import request from "supertest";
import app from "../src/app.js";

let token;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

describe("Auth API", () => {

    test("should register a user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser1",
                email: "test1@mail.com",
                password: password
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.username).toBe("testuser1");
        expect(response.body.data.user.email).toBe("test1@mail.com");

        expect(response.body.data.token).toBeDefined();
    });




    test("should login user", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test1@mail.com",
                password: password
            });

        token = response.body.token;

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe("testuser1");
        expect(response.body.user.email).toBe("test1@mail.com");

        expect(response.body.token).toBeDefined();
    });




    test("should get user profile", async () => {

        const response = await request(app)
            .get("/api/auth/getprofile")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.username).toBe("testuser1");
        expect(response.body.data.email).toBe("test1@mail.com");

    });

    test("should not register duplicate email", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser2",
                email: "test1@mail.com",
                password: password
            });

        expect(res.statusCode).toBe(400);
    });

});