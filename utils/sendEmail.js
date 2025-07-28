const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Money Mate" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    replyTo: "contact@ahmadproweb.com",
  });
};

module.exports = sendEmail;
