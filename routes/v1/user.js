import express from 'express';
import userController from '../../controllers/user.js';

const router = express.Router();

router.get('/list', userController.listUsers);
router.put('/update/:id', userController.updateUser);
router.get('/search/:id', userController.searchUserById);
router.get('/search', userController.searchUsers);

export default router;
