const mongoose = require('mongoose');
const User = mongoose.model('user');
const bCrypt = require('bcrypt-nodejs');

const newUser = (req, res, next) => {
  User.findOne({ login: req.body.username })
    .then(user => {
      if (user) {
        return req.send({error: 'Пользователь с таким логином уже существует'});
      } else {
        const newUser = new User();

        newUser.username = req.body.username;
        newUser.firstName = req.body.firstName;
        newUser.surName = req.body.surName;
        newUser.middleName = req.body.middleName;
        newUser.password = createHash(req.body.password);

        newUser
          .save()
          .then(user => {
            req.logIn(user, (err) => {
              if (err) {
                res.status(500);
                res.send({error: 'ошибка сервера, попробуйте позже'});
              }
              return res.send(newUser)
            });
          })
      }
    })
    .catch((error) => {
      res.status(500);
      return res.send({error: 'ошибка сервера, попробуйте позже'});
    });
};

var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = newUser;
