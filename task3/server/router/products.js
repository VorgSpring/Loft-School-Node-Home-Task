const { Router } = require(`express`);
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../store')();

const router = new Router();

router.post(`/`, (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('img', 'products');
  let fileName;

  console.log(path.join(process.cwd(), 'static', upload));
  form.uploadDir = path.join(process.cwd(), 'static', upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    if (files.photo.name === '' || files.photo.size === 0) {
      fs.unlink(files.photo.path);
      return res.redirect('admin/?msgfile=Не загружена картинка!');
    }

    if (!fields.name) {
      fs.unlink(files.photo.path);
      return res.redirect('admin/?msgfile=Не указано описание!');
    }

    const isNotNumber = parseInt(fields.price, 10) === NaN;
    if (!fields.price || isNotNumber) {
      fs.unlink(files.photo.path);
      return res.redirect('admin/?msgfile=Не указана цена!');
    }

    fileName = path.join('/', upload, files.photo.name);
    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        fs.unlink(fileName);
        fs.rename(files.photo.path, fileName);
      }
      db.stores.products.store.push({
        'name': fields.name,
        'price': fields.price,
        'src': fileName
      });
      db.save();
      res.redirect('admin/?msgfile=Картинка успешно загружена');
    })
  })
});

module.exports = router;