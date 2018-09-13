const mongoose = require('mongoose');
const logger = require('../logger/index');

const URL_DB = process.env.DB_HOST || 'mongodb://localhost:27017';
const ERROR_EXIT_CODE = 1;

mongoose.Promise = global.Promise;
module.exports = mongoose.connect(URL_DB, { useMongoClient: true }, () => {
  logger.error('Failed to connect to MongoDB', e);
  process.exitCode = ERROR_EXIT_CODE;
});
