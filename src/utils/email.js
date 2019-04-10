const nodemailer = require('nodemailer');

const sendEmail = (email, subject, text) => {
  const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWD,
    },
  });

  smtpTransport.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject,
    text,
  });
};

module.exports = { sendEmail };
