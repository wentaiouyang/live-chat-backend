import Chat from '../models/chat.js';
import Message from '../models/message.js';
import { getIO } from '../loaders/socket.js';

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chats and messages
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create chat
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [direct, group]
 *               participantId:
 *                 type: string
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat created
 */
// POST /chats
export const createChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'direct', participantId, participantIds = [], name } = req.body;

    let participants = [];

    if (type === 'direct') {
      if (!participantId) {
        return res.status(400).json({ message: 'participantId is required for direct chat' });
      }
      participants = [userId, participantId];
    } else if (type === 'group') {
      if (!participantIds.length) {
        return res.status(400).json({ message: 'participantIds is required for group chat' });
      }
      // include current user in group
      participants = Array.from(new Set([userId, ...participantIds]));
    } else {
      return res.status(400).json({ message: 'Invalid chat type' });
    }

    const chat = new Chat({
      type,
      name: type === 'group' ? name : undefined,
      participants,
    });

    await chat.save();

    // populate participants details for frontend
    await chat.populate('participants', 'username name email');

    const io = getIO();
    if (io) {
      chat.participants.forEach((participant) => {
        io.to(participant._id.toString()).emit('chat:created', chat);
      });
    }

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: List chats
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats
 */
// GET /chats
export const listChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username name email')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username name email' },
      })
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats/{chatId}:
 *   get:
 *     summary: Get chat detail
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Chat detail
 *       404:
 *         description: Chat not found
 */
// GET /chats/:chatId
export const getChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, participants: userId }).populate(
      'participants',
      'username name email'
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.json(chat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats/{chatId}:
 *   patch:
 *     summary: Update chat
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               addParticipants:
 *                 type: array
 *                 items:
 *                   type: string
 *               removeParticipants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Chat updated
 *       404:
 *         description: Chat not found
 */
// PATCH /chats/:chatId
export const updateChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { name, addParticipants = [], removeParticipants = [] } = req.body;

    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (name && chat.type === 'group') {
      chat.name = name;
    }

    if (addParticipants.length) {
      chat.participants = Array.from(
        new Set([...chat.participants.map((p) => p.toString()), ...addParticipants])
      );
    }

    if (removeParticipants.length) {
      chat.participants = chat.participants.filter(
        (p) => !removeParticipants.includes(p.toString())
      );
    }

    await chat.save();
    return res.json(chat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats/{chatId}/messages:
 *   get:
 *     summary: List messages in a chat
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of messages
 */
// GET /chats/:chatId/messages
export const listMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { before, limit = 20 } = req.query;

    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const query = { chat: chatId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats/{chatId}/messages:
 *   post:
 *     summary: Create message
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 default: text
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Message created
 */
// POST /chats/:chatId/messages
export const createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { content, type = 'text' } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'content is required' });
    }

    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = new Message({
      chat: chatId,
      sender: userId,
      content,
      type,
      readBy: [userId],
    });

    await message.save();

    chat.lastMessage = message._id;
    chat.lastMessageAt = message.createdAt;
    await chat.save();

    const populated = await message.populate('sender', 'username name email');

    const io = getIO();
    if (io) {
      io.to(chatId).emit('message:new', populated);
    }

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /chats/{chatId}/messages/{messageId}/read:
 *   post:
 *     summary: Mark message as read
 *     tags: [Chats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Message marked as read
 *       404:
 *         description: Chat or message not found
 */
// POST /chats/:chatId/messages/:messageId/read
export const markMessageRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = await Message.findOne({ _id: messageId, chat: chatId });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!message.readBy.map((id) => id.toString()).includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    const io = getIO();
    if (io) {
      io.to(chatId).emit('message:read', {
        chatId,
        messageId: messageId,
        userId,
      });
    }

    return res.json({ message: 'Message marked as read' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
