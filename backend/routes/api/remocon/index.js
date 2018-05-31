const _ = require('lodash');
const router = require('express').Router();
const controller = require('./remocon.controller');
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware.check);
router.get('/list', controller.userList);
router.get('/signal/list', controller.signalList);

router.post('/add/legacy', controller.addLegacy);
router.post('/add/macro', controller.addMacro);
// router.post('/add/learn', controller.addLearn);
// router.post('/update', controller.update);


const category = 'remocon';

const gateway = (sock, sockets) => {
    
    // sock.on(`req/${category}/create`, async (req) => {
    //     console.log('io-sensor/create');
    //     console.log(req);

    //     const rtn = await controller.createIO(req);
    //     console.log(rtn)

    //     sock.emit(`res/${category}/create`,rtn);
    // });
};

const client = (sock, sockets, io) => {
    
    sock.on(`req/${category}/learn`, (req) => {
        console.log('io-remocon/learn in client');
        console.log(req);
        const { gid } = sock;
        
        if (sockets[gid]) {
            io.of('/gateway').to(sockets[gid]).emit(`req/${category}/learn`);
        }
    });
};

exports.router = router;
exports.gateway = gateway;
exports.client = client;