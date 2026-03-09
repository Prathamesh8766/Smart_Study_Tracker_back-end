import express from "express";
import protect from "../middleware/auth.js";
import {
  addSubjectSession,
  getSessionsBySubjectController,
  deleteStudySessionController,
} from "../controllers/subjectSessionController.js";

const router = express.Router();


router.use(protect);


router.post("/add-subject-session", addSubjectSession);
router.get("/get-session-by-subject/:subjectId", getSessionsBySubjectController);
router.delete("/delete-study-session/:sessionId", deleteStudySessionController);

export default router;