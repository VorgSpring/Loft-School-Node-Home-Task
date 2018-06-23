const db = require('../store')();

const fildsName = ['age', 'concerts', 'cities', 'years'];

const controller = async(ctx, next) => {
  const { age, concerts, cities, years } = ctx.request.body;
  console.log(age, concerts, cities, years );
  const data = db.stores.skills.store;
  let isValid = true;

  [age, concerts, cities, years].forEach((item, i) => {
    const isNotNumber = parseInt(item, 10) === NaN;
    if (item < 0 || isNotNumber) {
      isValid = false;
      return;
    }
    db.stores.skills.store[i].number = item;
  });

  if (!isValid) {
    return ctx.redirect('/admin/?msgskill=incorrect');
  }

  db.save();
  ctx.redirect('/admin?msgskill=refresh');
};

module.exports = controller;