const db = require('../store')();

const controller = async(ctx, next) => {
  ctx.render(`index`, {
    products: db.stores.products.store,
    skills: db.stores.skills.store,
    msgemail: ctx.query.msgemail
  });
}

module.exports = controller;