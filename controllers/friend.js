import FriendRequest from '../models/friendRequest.js';
import User from '../models/user.js';

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend requests and friend list
 */

/**
 * @swagger
 * /friends/requests:
 *   post:
 *     summary: Create friend request
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toUserId:
 *                 type: string
 *             required:
 *               - toUserId
 *     responses:
 *       201:
 *         description: Friend request created
 *       400:
 *         description: Validation error
 */
// POST /friends/requests
export const createFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ message: 'toUserId is required' });
    }

    if (toUserId === fromUserId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const isFriend = await User.exists({ _id: fromUserId, friends: toUserId });
    if (isFriend) {
      return res.status(400).json({ message: 'Users are already friends' });
    }

    const existing = await FriendRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const request = new FriendRequest({
      from: fromUserId,
      to: toUserId,
    });
    await request.save();

    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: List friend requests
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of friend requests
 */
// GET /friends/requests
export const listFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await FriendRequest.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate('from', 'username name email')
      .populate('to', 'username name email');

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /friends/requests/{id}/accept:
 *   post:
 *     summary: Accept friend request
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       404:
 *         description: Not found
 */
// POST /friends/requests/:id/accept
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({ message: 'Not allowed to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'accepted';
    await request.save();

    // Add each other as friends
    await User.updateOne({ _id: request.from }, { $addToSet: { friends: request.to } });
    await User.updateOne({ _id: request.to }, { $addToSet: { friends: request.from } });

    return res.json({ message: 'Friend request accepted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /friends/requests/{id}/reject:
 *   post:
 *     summary: Reject friend request
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Friend request rejected
 *       404:
 *         description: Not found
 */
// POST /friends/requests/:id/reject
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({ message: 'Not allowed to reject this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'rejected';
    await request.save();

    return res.json({ message: 'Friend request rejected' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: List current user's friends
 *     tags: [Friends]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 */
// GET /friends
export const listFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends', 'username name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.friends || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
