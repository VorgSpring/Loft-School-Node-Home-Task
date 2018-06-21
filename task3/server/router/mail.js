const { Router } = require(`express`);
const nodemailer = require('nodemailer');
const bodyParser = require(`body-parser`);
const config = require('../config/mail.json');

const router = new Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.text) {
    return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
  }
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.text.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json({ msg: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' });
    }
    res.json({ msg: 'Письмо успешно отправлено!', status: 'Ok' });
  });
});

module.exports = router;
