const { Router } = require(`express`);
const bodyParser = require(`body-parser`);
const db = require('../store')();

const router = new Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get(`/`, (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  return res.render(`login`, {msgslogin: req.query.msgslogin});
});

router.post(`/`, (req, res) => {
  const {email, password} = req.body;
  const data = db.stores.login.store;

  if (email === data.email && password === data.password) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  return res.redirect('/login?msgslogin=неверный логин или пароль')
});

module.exports = router;