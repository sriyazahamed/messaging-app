const ContactModel = require('../database/models/contact');

module.exports = (
  io,
  socket,
) => {
  socket.on('contact/add', async (args) => {
    try {
      await new ContactModel(args).save();

      const data = await ContactModel.find({
        ownerId: args.ownerId,
      }).sort({
        profileName: 1,
      });

      socket.emit('contact/add/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('contact/add/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });

  socket.on('contact/get', async (args) => {
    try {
      const data = await ContactModel.find({
        ownerId: args.ownerId,
      }).sort({
        profileName: 1,
      });

      socket.emit('contact/get/callback', {
        success: true,
        data,
        message: null,
      });
    }
    catch (error0) {
      socket.emit('contact/get/callback', {
        success: false,
        data: null,
        message: error0.message,
      });
    }
  });
};
