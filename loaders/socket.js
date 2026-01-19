import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Chat from '../models/chat.js';
import Message from '../models/message.js';

let io;

export const getIO = () => io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Auth middleware for sockets
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      socket.user = { id: decoded.id };
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(userId);

    // client joins multiple chats rooms
    // payload: { chatIds: string[] }
    socket.on('chats:join', ({ chatIds } = {}) => {
      if (!Array.isArray(chatIds)) return;
      chatIds.forEach((chatId) => {
        socket.join(chatId);
      });
    });

    // send message via socket (alternative to HTTP POST /chats/:chatId/messages)
    // payload: { chatId, content, type? }
    socket.on('message:send', async ({ chatId, content, type = 'text' } = {}, callback) => {
      try {
        if (!chatId || !content) {
          const err = new Error('chatId and content are required');
          if (callback) callback({ error: err.message });
          return;
        }

        const chat = await Chat.findOne({ _id: chatId, participants: userId });
        if (!chat) {
          const err = new Error('Chat not found or access denied');
          if (callback) callback({ error: err.message });
          return;
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

        // emit to all participants in this chat room
        io.to(chatId).emit('message:new', populated);

        if (callback) {
          callback({ data: populated });
        }
      } catch (error) {
        if (callback) {
          callback({ error: error.message });
        }
      }
    });

    // typing indicators
    // payload: { chatId }
    socket.on('typing:start', ({ chatId } = {}) => {
      if (!chatId) return;
      socket.to(chatId).emit('typing:start', { chatId, userId });
    });

    socket.on('typing:stop', ({ chatId } = {}) => {
      if (!chatId) return;
      socket.to(chatId).emit('typing:stop', { chatId, userId });
    });
  });

  return io;
};
