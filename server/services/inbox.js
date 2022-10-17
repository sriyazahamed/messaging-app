const InboxModel = require('../database/models/inbox');
const ChatModel = require('../database/models/chat');

module.exports = (
  io,
  socket,
) => {
  socket.on('inbox/get', async (args) => {
    try {
      const data = await InboxModel.find({
        userId: args.userId,
      }).sort({ updatedAt: -1 });

      socket.emit('inbox/get/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('inbox/get/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('inbox/archived', async (args) => {
    try {
      await InboxModel.updateMany({
        $and: [
          { userId: args.userId },
          { roomId: { $in: args.data } },
        ],
      }, {
        $set: {
          archived: args.active,
        },
      });

      const data = await InboxModel.find({
        userId: args.userId,
      }).sort({ updatedAt: -1 });

      socket.emit('inbox/get/callback', {
        success: false,
        data,
        message: null,
        sound: false,
      });
    }
    catch (error0) {
      socket.emit('inbox/get/callback', {
        success: false,
        data: null,
        message: error0.message,
        sound: false,
      });
    }
  });

  socket.on('inbox/delete', async (args) => {
    try {
      await InboxModel.deleteMany({
        $and: [
          { userId: args.userId },
          { roomId: { $in: args.data } },
        ],
      });

      await ChatModel.deleteMany({
        $and: [
          { userId: args.userId },
          { roomId: { $in: args.data } },
        ],
      });

      const data = InboxModel.find({
        userId: args.userId,
      }).sort({ updatedAt: -1 });

      socket.emit('inbox/get/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('inbox/delete/callback', {
        success: true,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('inbox/open', async (args) => {
    try {
      const { userId, foreignId } = args;

      const inboxExists = await InboxModel.findOne({
        $and: [
          { owners: { $elemMatch: { userId } } },
          { owners: { $elemMatch: { userId: foreignId } } },
          { userId },
        ],
      });

      if (!inboxExists) throw inboxExists;

      socket.emit('inbox/open/callback', {
        success: true,
        data: inboxExists.roomId,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('inbox/open/callback', {
        success: false,
        data: null,
        message: null,
      });
    }
  });
};
