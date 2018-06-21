const { Router } = require(`express`);
const db = require('../store')();

const router = new Router();

router.get(`/`, (req, res) => {
  return res.render(`index`, {
    products: db.stores.products.store,
    skills: db.stores.skills.store
  });
});

module.exports = router;