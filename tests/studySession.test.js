import { jest } from "@jest/globals";
import Subject from "../src/models/Subject.js";
import StudySession from "../src/models/StudySession.js";
import {
  addSubjectSession,
  deleteStudySessionController,
  getSessionsBySubjectController,
} from "../src/controllers/subjectSessionController.js";

describe("study session controllers", () => {

  const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => jest.restoreAllMocks());

  test("addSubjectSession validates and creates", async () => {

    const res = createRes();
    await addSubjectSession({ body: {}, user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);

    jest.spyOn(Subject, "findOne").mockResolvedValue(null);
    const res2 = createRes();
    await addSubjectSession(
      { body: { subjectId: "s1", duration: 60 }, user: { _id: "u1" } },
      res2,
      jest.fn()
    );

    expect(res2.status).toHaveBeenCalledWith(404);

    Subject.findOne.mockResolvedValue({ _id: "s1" });
    jest.spyOn(StudySession, "create").mockResolvedValue({ _id: "ss1" });
    const res3 = createRes();
    await addSubjectSession(
      { body: { subjectId: "s1", duration: 60, notes: "ok" }, user: { _id: "u1" } },
      res3,
      jest.fn()
    );
    
    expect(res3.status).toHaveBeenCalledWith(201);

  });


  test("get sessions by subject", async () => {

    jest.spyOn(Subject, "findOne").mockResolvedValue(null);
    const res = createRes();
    await getSessionsBySubjectController({ params: { subjectId: "s1" }, user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);

    Subject.findOne.mockResolvedValue({ _id: "s1" });
    jest.spyOn(StudySession, "find").mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: "ss1" }]) });
    const res2 = createRes();
    await getSessionsBySubjectController({ params: { subjectId: "s1" }, user: { _id: "u1" } }, res2, jest.fn());
    expect(res2.status).toHaveBeenCalledWith(200);

  });


  test("delete study session", async () => {

    jest.spyOn(StudySession, "findOne").mockResolvedValue(null);
    const res = createRes();
    await deleteStudySessionController({ params: { sessionId: "ss1" }, user: { _id: "u1" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);

    StudySession.findOne.mockResolvedValue({ _id: "ss1" });
    jest.spyOn(StudySession, "deleteOne").mockResolvedValue({});
    const res2 = createRes();
    await deleteStudySessionController({ params: { sessionId: "ss1" }, user: { _id: "u1" } }, res2, jest.fn());
    expect(res2.status).toHaveBeenCalledWith(200);


  });

});