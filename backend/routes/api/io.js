/*
 * Function : api.io.js
 *
 * Description :
 *
 * Copyright (c) 2018, YongJun Kim
 * Licensed under the StaySharp0.
 */

const io = require('socket.io')();
const authMiddleware = require('./middlewares/auth.js');

const auth = require('./auth');
const sensor = require('./sensor');
const gateway = require('./gateway');
const remocon = require('./remocon');
const sockets = []

const gatewayClient = io.of('/gateway');
gatewayClient.use(authMiddleware.checkIO);
gatewayClient.on('connection', function(sock) {
    console.log('init gateway');

    sock.on('req/connection/init', (req) => {
        console.log('io-connection-gateway/init');
        console.log(req);

        sockets[req.gid] = sock.id;
    });

    auth.io(sock, sockets, io);
    sensor.gateway(sock, sockets, io);
    gateway.io(sock, sockets, io);
});

const client = io.of('/client');
client.on('connection', function(sock){
    console.log('init client');

    sock.on('req/connection/init', async (req) => {
        console.log('io-connection-client/init');
        // console.log('req', req);
        const info = await authMiddleware.verifyIO(req.token);

        sock.join(info._id);
    });
    
    sensor.client(sock, sockets, io);
    remocon.client(sock, sockets, io);
});


module.exports = io;