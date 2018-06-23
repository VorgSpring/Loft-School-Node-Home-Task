const Koa = require('koa');
const path = require('path');
const session = require("koa-session");
const static = require("koa-static");
const Pug = require('koa-pug');
const router = require(`./router`);

const app = new Koa();
const pug = new Pug({ 
  viewPath: 'client/template/pages', 
  pretty: true, 
  basedir: 'client/template', 
  noCache: true, 
  app: app 
});

app.use(static('server/static'));

app
  .use(session({
    "key": "key",
    "maxAge": "session",
    "overwrite": true,
    "httpOnly": true,
    "signed": false,
    "rolling": false,
    "renew": false
  }, app))
  .use(router.routes())
  .use(router.allowedMethods());

const HOSTNAME = process.env.SERVER_HOST || `127.0.0.1`;
const PORT = process.env.SERVER_PORT || 3000;
const SERVER_INFO_MESSAGE = `Server running at http://${HOSTNAME}:${PORT}/`;

module.exports = {
  run() {
    app.listen(PORT, HOSTNAME, () => {
      console.log(SERVER_INFO_MESSAGE);
    });
  },
  app
};