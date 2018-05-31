/*
 * Function : api.index.js
 *
 * Description :
 *
 * Copyright (c) 2018, YongJun Kim
 * Licensed under the StaySharp0.
 */

"use strict";

const router = require('express').Router();
const auth = require('./auth');
const sensor = require('./sensor');
const gateway = require('./gateway');
const page = require('./page');
const scheduler = require('./scheduler');
const remocon = require('./remocon');

router.use('/auth', auth.router);
router.use('/gateway', gateway.router);
router.use('/sensor', sensor.router);
router.use('/scheduler', scheduler.router);
router.use('/page', page.router);
router.use('/remocon', remocon.router);


module.exports = router;
