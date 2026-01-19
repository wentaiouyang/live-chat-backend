import express from 'express';
import {
  createChat,
  listChats,
  getChat,
  updateChat,
  listMessages,
  createMessage,
  markMessageRead,
} from '../../controllers/chat.js';
import authDecode from '../../middleware/authDecode.js';
import isUser from '../../middleware/isUser.js';

const router = express.Router();

// All chat endpoints require auth
router.use(authDecode, isUser);

router.post('/', createChat);
router.get('/', listChats);
router.get('/:chatId', getChat);
router.patch('/:chatId', updateChat);
router.get('/:chatId/messages', listMessages);
router.post('/:chatId/messages', createMessage);
router.post('/:chatId/messages/:messageId/read', markMessageRead);

export default router;


