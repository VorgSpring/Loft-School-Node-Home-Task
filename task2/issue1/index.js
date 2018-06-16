const http = require('http');
const { PORT, INTERVAL, TIMEOUT } = process.env;

const DEFAULT = {
  PORT: 3000,
  INTERVAL: 3000,
  TIMEOUT: 10000
};

const requestHandler = (request, response) => {
  let time;
  const interval = setInterval(() => {
    time = new Date().toUTCString();
    console.log(time);
  }, INTERVAL || DEFAULT.INTERVAL);

  setTimeout(() => {
    console.log('done');
    clearInterval(interval);
    response.end(time);
  }, TIMEOUT || DEFAULT.TIMEOUT);
};

const server = http.createServer(requestHandler);

const port = PORT || DEFAULT.PORT;
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
