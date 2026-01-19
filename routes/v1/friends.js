import express from 'express';
import {
  createFriendRequest,
  listFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  listFriends,
} from '../../controllers/friend.js';
import authDecode from '../../middleware/authDecode.js';
import isUser from '../../middleware/isUser.js';

const router = express.Router();

// All friend endpoints require auth
router.use(authDecode, isUser);

router.post('/requests', createFriendRequest);
router.get('/requests', listFriendRequests);
router.post('/requests/:id/accept', acceptFriendRequest);
router.post('/requests/:id/reject', rejectFriendRequest);
router.get('/', listFriends);

export default router;


