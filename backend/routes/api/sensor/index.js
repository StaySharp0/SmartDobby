const router = require('express').Router();
const controller = require('./sensor.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.post('/update', controller.update);

const io = (sock) => {
    sock.on('/register',(res) => {
        console.log('io-sensor/register');
        console.log(res);
    });
};

exports.router = router;
exports.io = io;