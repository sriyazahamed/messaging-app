const userService = require('./user');
const contactService = require('./contact');
const chatService = require('./chat');
const inboxService = require('./inbox');

let users = [];

const service = (io, socket) => {
  socket.on('user/connect', (args) => {
    try {
      const exists = users.find((item) => item.userId === args.userId);

      if (exists && users.length > 0) {
        const newError = {
          message: 'pengguna sedang aktif di tab lain',
        };
        throw newError;
      }

      users.push(args);

      io.emit('user/connect/callback', {
        success: true,
        data: users,
        message: null,
      });
    }
    catch (error0) {
      io.emit('user/connect/callback', {
        success: false,
        message: error0.message,
      });
    }
  });

  userService(io, socket, users);
  contactService(io, socket, users);
  chatService(io, socket, users);
  inboxService(io, socket, users);

  socket.on('user/logout', (args) => {
    users = users.filter((item) => item.userId !== args.userId);

    io.emit('user/connect/callback', {
      success: true,
      data: users,
      message: null,
    });
  });

  socket.on('disconnect', () => {
    users = users.filter((item) => item.socketId !== socket.id);

    io.emit('user/connect/callback', {
      success: true,
      data: users,
      message: null,
    });
  });
};

module.exports = service;
