import request from "supertest";
import app from "../src/app.js";

let token;
let subjectId;
let sessionId;

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

describe("Study Session API", () => {

  /* LOGIN USER */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: email,
        password: password
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  /* CREATE SUBJECT */
  test("should create subject", async () => {
    const res = await request(app)
      .post("/api/subject/create-subject")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Math"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    subjectId = res.body.data._id;
    expect(subjectId).toBeDefined();
  });

  /* CREATE STUDY SESSION */
  test("should create study session", async () => {
    const res = await request(app)
      .post("/api/studySession/add-subject-session")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subjectId: subjectId,    // ✅ FIXED HERE
        duration: 2,
        date: "2026-03-08",
        notes: "Test math session"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    sessionId = res.body.data._id;

    expect(res.body.data.subjectId).toBe(subjectId);
    expect(res.body.data.duration).toBe(2);
  });

  /* GET SESSIONS BY SUBJECT */
  test("should get sessions by subject", async () => {
    const res = await request(app)
      .get(`/api/studySession/get-session-by-subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /* DELETE SESSION */
  test("should delete study session", async () => {
    const res = await request(app)
      .delete(`/api/studySession/delete-study-session/${sessionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Session deleted successfully");
  });

});