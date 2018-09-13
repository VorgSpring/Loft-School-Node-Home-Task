const mongoose = require('mongoose');
const User = mongoose.model('user');

getUsers = async (req, res) => {
  User
    .find()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ err: err.message });
    })
};

module.exports = getUsers;