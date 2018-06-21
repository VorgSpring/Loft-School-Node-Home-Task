const { Router } = require(`express`);
const db = require('../store')();

const router = new Router();

router.get(`/`, (req, res) => {
  return res.render(`index`, {
    products: db.stores.products.store,
    skills: db.stores.skills.store
  });
});

router.get(`/admin`, (req, res, next) => {
  if (req.session.isAdmin) {
    return res.render('admin', {
      msgfile: req.query.msgfile,
      msgskill: req.query.msgskill,
      skills: db.stores.skills.store
    });
  }
  next();
});

module.exports = router;