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

router.use('/auth', auth.router);
router.use('/sensor', sensor.router);

module.exports = router;
