const router = require('express').Router();
const controller = require('./auth.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/signup', controller.register);

router.post('/signin', controller.login);

router.use('/info', authMiddleware.check);
router.get('/info', controller.info);

router.use('/refresh', authMiddleware.check);
router.get('/refresh', controller.refresh);

const io = (sock) => {
    const category = 'auth';
;
    sock.on(`req/${category}/gateway/create`, async (req) => {
        console.log('io-gatway/create');
        console.log(req);

        const rtn = await controller.createGatwayIO(req);
        // console.log(rtn);

        sock.emit(`res/${category}/gateway/create`,rtn);
    });
};

exports.router = router;
exports.io = io;