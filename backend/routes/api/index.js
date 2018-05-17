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

router.use('/auth', auth.router);
router.use('/sensor', sensor.router);
router.use('/gateway', gateway.router);

module.exports = router;
