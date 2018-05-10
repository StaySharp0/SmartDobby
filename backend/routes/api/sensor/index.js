const router = require('express').Router();
const controller = require('./sensor.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.post('/update', controller.update);

const io = (sock) => {
    const category = 'sensor';

    sock.on(`req/${category}/create`, async (req) => {
        console.log('io-sensor/create');
        console.log(req);

        const rtn = await controller.createIO(req);
        console.log(rtn)

        sock.emit(`res/${category}/create`,rtn);
    });

    sock.on(`req/${category}/update`, async (req) => {
        console.log('io-sensor/update');
        console.log(req);

        const rtn = await controller.updateIO(req);
        console.log(rtn)

        sock.emit(`res/${category}/update`, rtn);
    });
};

exports.router = router;
exports.io = io;