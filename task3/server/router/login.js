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
  return res.render(`login`);
});

router.post(`/`, (req, res) => {
  const {email, password} = req.body;
  const data = db.stores.login.store;

  if (email === data.email && password === data.password) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.status(401);
  return res.send("HTTP 403 Forbidden");
});

module.exports = router;