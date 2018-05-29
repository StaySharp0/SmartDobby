const router = require('express').Router();
const controller = require('./sensor.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.post('/update', controller.update);
router.get('/list', controller.list);

const category = 'sensor';

const gateway = (sock, sockets) => {
    
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
        const { token, gid, sid } = req;

        const rtn = await controller.updateIO(req);
        console.log(rtn)

        if (sockets[token]) {
            sockets[token].emit(`res/${category}/refresh/${gid}/${sid}`, rtn);
        }
    });
};

const client = (sock, sockets, io) => {
    
    sock.on(`req/${category}/refresh`, (req) => {
        console.log('io-sensor/refresh in client');
        console.log(req);
        const { gid, sid } = req;
        
        if (sockets[gid]) {
            io.of('/gateway').to(sockets[gid]).emit(`123`, { sid: sid });
        }
    });

};

exports.router = router;
exports.gateway = gateway;
exports.client = client;