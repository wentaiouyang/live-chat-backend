import express from 'express';
import userController from '../../controllers/user';

const router = express.Router();

router.get('/list', userController.listUsers);
router.post('/add', userController.addUser);
router.put('/update/:id', userController.updateUser);

export default router;
