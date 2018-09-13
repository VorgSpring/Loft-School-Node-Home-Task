const express = require(`express`);
const logger = require(`./logger/`);

const app = express();

app.use('/', express.static(`static`));

app.get(`*`, (_, res) => {
  return res.redirect('/');
});

const HOSTNAME = process.env.SERVER_HOST || `127.0.0.1`;
const PORT = process.env.SERVER_PORT || 3000;
const SERVER_INFO_MESSAGE = `Server running at http://${HOSTNAME}:${PORT}/`;

app.listen(PORT, HOSTNAME, () => {
  logger.info(SERVER_INFO_MESSAGE);
});
