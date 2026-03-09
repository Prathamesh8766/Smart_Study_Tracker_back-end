import express from 'express';
import protect from '../middleware/auth.js';
import{
    createSubjectController,
    getAllSubjectController,
    getOneSubjectContoller,
    updateSubjectController,
    deleteSubjectController
} from '../controllers/stubjectContoller.js';

const router = express.Router();

router.use(protect); // here use is midleware

router.post('/create-subject', createSubjectController);
router.get('/getall-subject', getAllSubjectController);
router.get('/get-one-subject/:id', getOneSubjectContoller);
router.put('/update-subject/:id', updateSubjectController);
router.delete('/delete-subject/:id', deleteSubjectController);

export default router;


