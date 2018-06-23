const Router = require('koa-router');
const koaBody = require('koa-body');

const pageController = require('../controllers/page');
const mailController = require('../controllers/mail');
const loginController = require('../controllers/login');
const adminController = require('../controllers/admin');
const productsController = require('../controllers/products');
const skillsController = require('../controllers/skills');

const router = new Router();

router.get('/', pageController);
router.post('/mail', koaBody(), mailController);
router.get('/login', loginController.get);
router.post('/login', koaBody(), loginController.post);
router.post('/products', koaBody({
  formidable: {
    uploadDir: process.cwd() + "/server/static/img/products/"
  },
  multipart: true,
}), productsController);
router.post('/skills', koaBody(), skillsController);
router.get('/admin', adminController);

router.get('*', async (ctx, next) => {
  ctx.render('error');
});

module.exports = router;
