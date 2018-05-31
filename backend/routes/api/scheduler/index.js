const router = require('express').Router();
const controller = require('./scheduler.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.post('/add', controller.create);

const io = (sock) => {
    const category = 'scheduler';
};

exports.router = router;
exports.io = io;