import { jest } from "@jest/globals";
import Subject from "../src/models/Subject.js";
import StudySession from "../src/models/StudySession.js";

import {
  createSubjectController,
  deleteSubjectController,
  getAllSubjectController,
  getOneSubjectContoller,
  updateSubjectController,
} from "../src/controllers/stubjectContoller.js";


describe("subject controllers", () => {

  const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };


  afterEach(() => jest.restoreAllMocks());
  test("create subject validates title and creates subject", async () => {
    const res = createRes();
    await createSubjectController({ body: {}, user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    jest.spyOn(Subject, "create").mockResolvedValue({ _id: "s1", title: "Math" });
    const res2 = createRes();
    await createSubjectController({ body: { title: "Math" }, user: { _id: "u1" } }, res2, jest.fn());
    expect(res2.status).toHaveBeenCalledWith(201);
  });


  test("get all and one subject", async () => {


    jest.spyOn(Subject, "find").mockResolvedValue([{ _id: "s1" }]);
    const res = createRes();
    await getAllSubjectController({ user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);

    jest.spyOn(Subject, "findOne").mockResolvedValue(null);
    const res2 = createRes();
    await getOneSubjectContoller({ params: { id: "x" }, user: { _id: "u1" } }, res2, jest.fn());
    expect(res2.status).toHaveBeenCalledWith(404);

    Subject.findOne.mockResolvedValue({ _id: "s1" });
    const res3 = createRes();
    await getOneSubjectContoller({ params: { id: "s1" }, user: { _id: "u1" } }, res3, jest.fn());
    expect(res3.status).toHaveBeenCalledWith(200);

  });

  test("update and delete subject", async () => {

    const res = createRes();
    await updateSubjectController({ body: {}, params: { id: "s1" }, user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);

    jest.spyOn(Subject, "findOne").mockResolvedValue(null);
    const res2 = createRes();
    await updateSubjectController(
      { body: { title: "Physics" }, params: { id: "s1" }, user: { _id: "u1" } },
      res2,
      jest.fn()
    );
    expect(res2.status).toHaveBeenCalledWith(404);


    Subject.findOne.mockResolvedValue({ _id: "s1", title: "Math", save: jest.fn().mockResolvedValue(true) });
    const res3 = createRes();
    await updateSubjectController(
      { body: { title: "Physics" }, params: { id: "s1" }, user: { _id: "u1" } },
      res3,
      jest.fn()
    );
    expect(res3.status).toHaveBeenCalledWith(200);


    Subject.findOne.mockResolvedValue(null);
    const res4 = createRes();
    await deleteSubjectController({ params: { id: "s1" }, user: { _id: "u1" } }, res4, jest.fn());
    expect(res4.status).toHaveBeenCalledWith(404);

    Subject.findOne.mockResolvedValue({ _id: "s1" });
    jest.spyOn(StudySession, "deleteMany").mockResolvedValue({});
    jest.spyOn(Subject, "deleteOne").mockResolvedValue({});
    const res5 = createRes();
    await deleteSubjectController({ params: { id: "s1" }, user: { _id: "u1" } }, res5, jest.fn());
    expect(res5.status).toHaveBeenCalledWith(200);


  });
});