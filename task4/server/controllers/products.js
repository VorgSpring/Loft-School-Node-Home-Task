const fs = require('fs');
const path = require('path');
const util = require('util');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const db = require('../store')();

const controller = async (ctx, next) => {
  const files = ctx.request.files.photo;
  const fields = ctx.request.body;

  if (files.name === '' || files.size === 0) {
    await unlink(files.path);
    return ctx.redirect('/admin?msgfile=No picture uploaded!');
  }

  if (!fields.name) {
    await unlink(files.path);
    return ctx.redirect('/admin?msgfile=No description specified!');
  }

  const isNotNumber = parseInt(fields.price, 10) === NaN;
  if (!fields.price || isNotNumber) {
    await unlink(files.path);
    return ctx.redirect('/admin?msgfile=Not the price!');
  }

  let fileName = path.join(process.cwd(), "/server/static/img/products/", files.name);
  const error = await rename(files.path, fileName);
  if (error) {
    await unlink(fileName);
    await rename(files.path, fileName);
  }
  let dir = fileName.substr(fileName.indexOf('/img'));
  db.stores.products.store.push({
    'name': fields.name,
    'price': fields.price,
    'src': dir
  });
  db.save();

  ctx.redirect('/admin?msgfile=The picture is successfully loaded');
};

module.exports = controller;