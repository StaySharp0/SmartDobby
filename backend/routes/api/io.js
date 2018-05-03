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

io.sockets.on('connection', function(sock) {
    console.log('connection');

    sock.on('init', (res) => {
        console.log('io/init');
        console.log(res);

        // io-sesnor/regist (DB에 Sensor 등록)

        // io/init.done (rtn: sid, name, interval)
    });

    sensor.io(sock);
});

module.exports = io;