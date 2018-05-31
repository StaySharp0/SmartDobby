const _ = require('lodash');
const router = require('express').Router();
const controller = require('./sensor.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.post('/update', controller.update);
router.get('/list', controller.list);

const category = 'sensor';

const gateway = (sock, sockets, io) => {
    
    sock.on(`req/${category}/create`, async (req) => {
        console.log('io-sensor/create');
        console.log(req);

        const rtn = await controller.createIO(req);
        console.log(rtn)

        sock.emit(`res/${category}/create`,rtn);
    });

    sock.on(`req/${category}/update`, async (req) => {
        console.log('io-sensor/update');
        // console.log(req);
        const { token, sid } = req;

        const rtn = await controller.updateIO(req);
        io.of('/client').to(sock.decoded._id).emit(`res/${category}/update/${sid}`, req);
    });
};

const client = (sock, sockets, io) => {
    
    sock.on(`req/${category}/refresh`, (req) => {
        console.log('io-sensor/refresh in client');
        console.log(req);
        const { gid, sid } = req;
        
        if (sockets[gid]) {
            io.of('/gateway').to(sockets[gid]).emit(`req/${category}/refresh`, { sid: sid });
        }
    });

    sock.on(`req/${category}/update/info`, async (req) => {
        console.log('io-sensor/update/info in client');
        console.log(req);
        const { gid, sid } = req;

        const rtn = await controller.updateInfoIO(req);
        sock.emit(`res/${category}/update/info/${sid}`,rtn);

        if(!_.isUndefined(req.period)){
            io.of('/gateway')
                .to(sockets[gid])
                .emit(`req/${category}/update/interval`, { sid: sid, interval: req.period});
        }
        if(!_.isUndefined(req.name)) {
            io.of('/gateway')
                .to(sockets[gid])
                .emit(`req/${category}/update/name`, { sid: sid, name: req.name });

        }   
    });

};

exports.router = router;
exports.gateway = gateway;
exports.client = client;