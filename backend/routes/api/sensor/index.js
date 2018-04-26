const router = require('express').Router();
const controller = require('./sensor.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);

router.post('/update', controller.update);

module.exports = router
