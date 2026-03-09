import Subject from "../models/Subject.js";
import StudySession from "../models/StudySession.js";

/* CREATE STUDY SESSION */
export const addSubjectSession = async (req, res, next) => {
  try {

    const { subjectId, date, duration, notes } = req.body;

    if (!subjectId || !duration) {
      return res.status(400).json({
        success: false,
        message: "Subject and duration are required"
      });
    }

    const subject = await Subject.findOne({
      _id: subjectId,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not exist"
      });
    }

    const session = await StudySession.create({
      subjectId: subjectId,
      user: req.user._id,
      duration,
      date,
      notes
    });

    res.status(201).json({
      success: true,
      data: session
    });

  } catch (error) {
    next(error);
  }
};


/* GET SESSIONS BY SUBJECT */
export const getSessionsBySubjectController = async (req, res, next) => {
  try {

    const { subjectId } = req.params;

    const subject = await Subject.findOne({
      _id: subjectId,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const sessions = await StudySession.find({
      subject: subjectId,
      user: req.user._id
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: sessions
    });

  } catch (error) {
    next(error);
  }
};


/* DELETE SESSION */
export const deleteStudySessionController = async (req, res, next) => {
  try {

    const { sessionId } = req.params;

    const session = await StudySession.findOne({
      _id: sessionId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    await StudySession.deleteOne({
      _id: sessionId
    });

    res.status(200).json({
      success: true,
      message: "Session deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};