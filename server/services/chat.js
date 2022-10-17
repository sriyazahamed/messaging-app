const ChatModel = require('../database/models/chat');
const InboxModel = require('../database/models/inbox');
const WordModel = require('../database/models/word')

module.exports = (
  io,
  socket,
  users,
) => {
  socket.on('chat/get', async (args) => {
    try {
      const { userId, foreignId } = args;

      const inbox = await InboxModel.findOne({
        $and: [
          { owners: { $elemMatch: { userId } } },
          { owners: { $elemMatch: { userId: foreignId } } },
          { userId },
        ],
      });

      const data = await ChatModel.find({
        $and: [
          { userId },
          { roomId: inbox.roomId },
        ],
      });

      socket.emit('chat/get/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('chat/get/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('chat/add', async (args) => {
    try {
      const foreign = users.find((item) => item.userId === args.to.userId);
      let {
        roomId, message, reply, from, to,
      } = args;

      const userInboxExists = await InboxModel.findOne({
        $and: [
          { userId: from.userId },
          { roomId },
        ],
      });

      const foreignInboxExists = await InboxModel.findOne({
        $and: [
          { userId: to.userId },
          { roomId },
        ],
      });
      
     const offensiveWordsList = await WordModel.find({});
      
      let mySet = new Set()
      for(let i=0;i<offensiveWordsList.length;i++){
        
        mySet.add(offensiveWordsList[i]["word"])
      }
    
    mySet.forEach(element => {
     message = message.replace(element, "*****");
    });
   
      
      const chat = await new ChatModel({
        roomId, userId: from.userId, from: from.userId, message, reply,
      }).save();

      await new ChatModel({
        roomId, userId: to.userId, from: from.userId, message, reply,
      }).save();

      if (userInboxExists) {
        await InboxModel.findOneAndUpdate({
          $and: [
            { userId: from.userId },
            { roomId },
          ],
        }, {
          $set: {
            lastMessage: {
              from: from.userId,
              text: message,
              createdAt: chat.createdAt,
            },
          },
          $inc: { total: 1 },
        });
      } else {
        await new InboxModel({
          userId: from.userId,
          roomId,
          owners: [from, to],
          lastMessage: {
            from: from.userId,
            text: message,
            createdAt: chat.createdAt,
          },
          total: 1,
        }).save();
      }

      if (foreignInboxExists) {
        await InboxModel.findOneAndUpdate({
          $and: [
            { userId: to.userId },
            { roomId },
          ],
        }, {
          $set: {
            lastMessage: {
              from: from.userId,
              text: message,
              createdAt: chat.createdAt,
            },
          },
          $inc: { total: 1 },
        });
      } else {
        await new InboxModel({
          userId: to.userId,
          roomId,
          owners: [to, from],
          lastMessage: {
            from: from.userId,
            text: message,
            createdAt: chat.createdAt,
          },
          total: 1,
        }).save();
      }

      const userChat = await ChatModel.find({
        $and: [{ userId: from.userId }, { roomId }],
      });

      const userInbox = await InboxModel.find({
        userId: from.userId,
      }).sort({ updatedAt: -1 });

      socket.emit('chat/get/callback', {
        success: true,
        data: userChat,
        message: null,
      });

      socket.emit('inbox/get/callback', {
        success: true,
        data: userInbox,
        message: null,
        sound: false,
      });

      if (foreign) {
        const foreignChat = await ChatModel.find({
          $and: [{ userId: to.userId }, { roomId }],
        });

        io
          .to(foreign.socketId)
          .emit('chat/get/callback', {
            success: true,
            data: foreignChat,
            message: null,
          });

        const foreignInbox = await InboxModel.find({
          userId: to.userId,
        }).sort({ updatedAt: -1 });

        io
          .to(foreign.socketId)
          .emit('inbox/get/callback', {
            success: true,
            data: foreignInbox,
            message: null,
            sound: true,
          });
      }
    }
    catch (error0) {
      socket.emit('chat/add/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('chat/read', async (args) => {
    try {
      const { userId, foreignId, roomId } = args;
      const foreign = users.find((item) => item.userId === args.foreignId);

      const check = await InboxModel.findOne({
        $and: [{ roomId }, { 'lastMessage.condition': 'read' }],
      });

      if (check) {
        const newError = {
          message: 'message has been read',
        };
        throw newError;
      }

      await InboxModel.updateMany({ roomId }, {
        $set: {
          'lastMessage.condition': 'read',
          total: 0,
        },
      });

      await ChatModel.updateMany({
        $and: [{ roomId }, { condition: 'sent' }],
      }, { $set: { condition: 'read' } });

      const foreignInbox = await InboxModel.find({
        userId: foreignId,
      }).sort({ updatedAt: -1 });

      const foreignChat = await ChatModel.find({
        $and: [{ userId: foreignId }, { roomId }],
      });

      const userInbox = await InboxModel.find({
        userId,
      }).sort({ updatedAt: -1 });

      socket.emit('inbox/get/callback', {
        success: true,
        data: userInbox,
        message: null,
        sound: false,
      });

      io.to(foreign.socketId).emit('chat/get/callback', {
        success: true,
        data: foreignChat,
        message: null,
      });

      io.to(foreign.socketId).emit('inbox/get/callback', {
        success: true,
        data: foreignInbox,
        message: null,
        sound: false,
      });
    }
    catch (error0) {
      socket.emit('chat/read/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });
};
