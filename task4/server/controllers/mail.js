const nodemailer = require('nodemailer');
const config = require('../config/mail.json');

const controller = async(ctx, next) => {
  if (!ctx.request.body.name || !ctx.request.body.email || !ctx.request.body.text) {
    return ctx.redirect('/?msgemail=All fields need to be filled!');
  }
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${ctx.request.body.name}" <${ctx.request.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      ctx.request.body.text.trim().slice(0, 500) +
      `\n Отправлено с: <${ctx.request.body.email}>`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return ctx.redirect('/?msgemail=An error occurred while sending the email!');
    }
    return ctx.redirect('/?msgemail=A letter has been sent!');
  });
}

module.exports = controller;
