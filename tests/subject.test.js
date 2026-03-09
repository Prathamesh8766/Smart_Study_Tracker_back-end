import request from "supertest";
import app from "../src/app.js";

let token;
let subjectId;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

describe("Subject API", () => {

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: email,
        password: password
      });
  
    token = res.body.token;
  });

  test("should create subject", async () => {
    const response = await request(app)
      .post("/api/subject/create-subject")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Math"
      });

    expect(response.statusCode).toBe(201);

    subjectId = response.body.data._id;
  });

  test("should get all subjects", async () => {
    const response = await request(app)
      .get("/api/subject/getall-subject")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("should get one subject", async () => {
    const response = await request(app)
      .get(`/api/subject/get-one-subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("should update subject", async () => {
    const response = await request(app)
      .put(`/api/subject/update-subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Physics"
      });

    expect(response.statusCode).toBe(200);
  });

  test("should delete subject", async () => {
    const response = await request(app)
      .delete(`/api/subject/delete-subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

});