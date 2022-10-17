const jwt = require('jsonwebtoken');
const { ProfileModel } = require('../database/models/user');

module.exports = (io, socket) => {
  socket.on('user/findOne', async (args) => {
    try {
      const request = await jwt.verify(args.token);
      const data = await ProfileModel.findOne({ userId: request.userId });

      io.emit('user/findOne/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      io.emit('user/findOne/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('user/update', async (args) => {
    try {
      await ProfileModel.findOneAndUpdate({ userId: args._id }, {
        $set: {
          profileName: args.profileName,
          bio: args.bio,
          phone: args.phone,
          photo: {
            banner: args.banner,
            avatar: args.avatar,
          },
        },
      });

      const data = await ProfileModel.findOne({ userId: args._id });

      io.emit('user/update/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      io.emit('user/update/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });
};
