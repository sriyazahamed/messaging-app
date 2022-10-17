const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports = async (args) => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    let transportConfig;

    if (isDev) {
      transportConfig = {
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      transportConfig = {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_NAME,
          pass: process.env.GMAIL_PASS,
        },
      };
    }

    const transport = await nodemailer.createTransport(transportConfig);

    let rawData = fs.readFileSync(`${__dirname}/mail.html`, 'utf-8');

    rawData = rawData.replace(/#profilename#/g, args.username);
    rawData = rawData.replace(/#regiscode#/g, args.key);

    await transport.sendMail({
      from: process.env.GMAIL_NAME,
      to: args.email,
      subject: 'Verify Your Email Address ~ Messaging',
      html: rawData,
    });
  }
  catch (error0) {
    console.log(error0.message);
  }
};
