const db = require('../store')();

const controller =  async(ctx, next) => {
  if (ctx.session.isAdmin) {
    return ctx.render('admin', {
      msgfile: ctx.query.msgfile,
      msgskill: ctx.query.msgskill,
      skills: db.stores.skills.store
    });
  }
  next();
};

module.exports = controller;