const router = require('express').Router();
const controller = require('./auth.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/signup', controller.register);

router.post('/signin', controller.login);

router.use('/info', authMiddleware.check);
router.get('/info', controller.info);

router.use('/refresh', authMiddleware.check);
router.get('/refresh', controller.refresh);

module.exports = router
