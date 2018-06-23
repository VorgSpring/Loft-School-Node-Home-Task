const db = require('../store')();

const get = async(ctx, next) => {
  if (ctx.session.isAdmin) {
    return ctx.redirect('/admin');
  }

  return ctx.render(`login`, {
    msgslogin: ctx.query.msgslogin
  });
}

const post = async(ctx, next) => {
  const { email, password } = ctx.request.body;
  const data = db.stores.login.store;

  if (email === data.email && password === data.password) {
    ctx.session.isAdmin = true;
    return ctx.redirect('/admin');
  }

  return ctx.redirect('/login?msgslogin=неверный логин или пароль');
}

module.exports = {
  get, post
};
