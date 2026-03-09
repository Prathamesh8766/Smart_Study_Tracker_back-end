import Subject from "../models/Subject.js";
import StudySession from "../models/StudySession.js";

/* CREATE SUBJECT */
export const createSubjectController = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const subject = await Subject.create({
            title,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            data: subject
        });

    } catch (error) {
        next(error);
    }
};


/* GET ALL SUBJECTS FOR LOGGED USER */
export const getAllSubjectController = async (req, res, next) => {
    try {

        const subjects = await Subject.find({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });

    } catch (error) {
        next(error);
    }
};

export const getOneSubjectContoller = async (req, res, next) => {
    try {

        const subject = await Subject.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        next(error)
    }
}

export const updateSubjectController = async (req, res, next) => {
  try {

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    subject.title = title;
    await subject.save();

    res.status(200).json({
      success: true,
      data: subject,
      message: "Subject updated"
    });

  } catch (error) {
    next(error);
  }
};

export const deleteSubjectController = async (req, res, next) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // Delete related study sessions
    await StudySession.deleteMany({
      subject: req.params.id
    });

    // Delete subject
    await Subject.deleteOne({
      _id: req.params.id
    });

    res.status(200).json({
      success: true,
      message: "Subject and related study sessions deleted"
    });

  } catch (error) {
    next(error);
  }
};