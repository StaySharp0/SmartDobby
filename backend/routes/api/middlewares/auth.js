/*
 * Function : api.middleware.auth.js
 *
 * Description :
 *
 * Copyright (c) 2018, YongJun Kim
 * Licensed under the StaySharp0.
 */

"use strict";
const jwt = require('jsonwebtoken');

const verifyJWT = (token, secret) => {
    return  new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) reject(err);
            resolve(decoded);
        });
    });
};

exports.check = async (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token;
    const secret = req.app.get('jwt-secret');
    
    // token does not exist
    if (!token) {
        return res.status(400).json(ApiRes(false, 'UL9000', '유저확인 실패'));
    }
    // create a promise that decodes the token
    try {
        const user = await verifyJWT(token, secret);
        req.decoded = user;
        next();
    }
    catch (e) {
        if(e.name === 'TokenExpiredError'){
            return res.status(400).json(ApiRes(false, 'UL9001', '만료된 토큰'));
        }
        return res.status(400).json(ApiRes(false, 'UL9000', '유저확인 실패'));
    }
}