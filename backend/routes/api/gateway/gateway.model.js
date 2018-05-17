const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');

const tbl = 'UGateway';

exports.getList = function(ipt) {
    return knex(tbl).where('UID',ipt.uid).select();
}