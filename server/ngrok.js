const ngrok = require('ngrok');

module.exports = async (port) => {
  try {
    const url = await ngrok.connect({
      authtoken: process.env.NGROK_AUTH_TOKEN,
      addr: port,
      proto: 'http',
    });

    console.log(`ngrok tunnel: ${url}`);
  }
  catch (error0) {
    console.log(error0.message);
  }
};
