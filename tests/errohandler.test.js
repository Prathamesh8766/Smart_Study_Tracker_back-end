import request from "supertest";
import app from '../src/app.js'

let token;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;
describe("ErrorHandler", () => {

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: email,
                password: password
            });
        expect(res.statusCode).toBe(200);
        token = res.body.token;
    });

    test('should detect CastError', async () => {
        let sessionId = "65dahkf47292bfaifnr"
        const res = await request(app)
            .post('/api/studySession/delete-study-session/${sessionId}')
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("Resource not found");
    });

    test("should detect 11000", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "123456"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("email already exists");
        expect(res.body.statusCode).toBe(400);

    });

    test("Sould detect validation error", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "",
                password: "123456"
            });

        expect(res.statusCode).toBe(400); 
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Provide email and password");
    });

    test("Should detect jsonwebTokenError" ,async () => {
        token = "jksdkjnsslkdlkd;kwekju298198u3983kjdkja"
        const res = await request(app)
        .post("/api/subject/create-subject")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Math"
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid token");
      expect(res.body.success).toBe(false)

    });




});