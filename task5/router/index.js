const express = require('express');
const router = express.Router();

const user = require('../controllers/user');
const news = require('../controllers/news');
const login = require('../controllers/login');

router.post('/saveNewUser', user.save);
router.put('/updateUser', user.update);
router.post('/saveUserImage', user.image);
router.get('/getUsers', user.get);
router.put('/updateUserPermission', user.permission);
router.delete('/deleteUser', user.delete);

router.post('/login', login.auth);
router.post('/authFromToken', login.authFromToken);

router.get('/getNews', news.get);
router.post('/newNews', news.new);
router.put('/updateNews', news.update);
router.delete('/deleteNews', news.delete);

router.all('*', (_, res) => {
  res.status(404);
  return res.send(`not found`);
});

module.exports = router;
