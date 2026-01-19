import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import friendsRouter from './friends.js';
import chatsRouter from './chats.js';

const router = express.Router();
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/friends', friendsRouter);
router.use('/chats', chatsRouter);

export default router;
