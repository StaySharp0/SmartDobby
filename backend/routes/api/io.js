/*
 * Function : api.io.js
 *
 * Description :
 *
 * Copyright (c) 2018, YongJun Kim
 * Licensed under the StaySharp0.
 */

const io = require('socket.io')();

const auth = require('./auth');
const sensor = require('./sensor');
const gateway = require('./gateway');

io.sockets.on('connection', function(sock) {
    console.log('connection');

    auth.io(sock);
    sensor.io(sock);
    gateway.io(sock);
});

module.exports = io;