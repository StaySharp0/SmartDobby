const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');

const tbl = 'UGateway';

exports.createGateway = function (ipt) {
    return knex(tbl).insert(ipt)
      .then((result) => {
        return {
          status: true,
          result: result[0],
        };
      }).catch((err) => {
        return {
          status: false,
          code: err.code,
        };
      });
}

exports.getList = function(ipt) {
    return knex(tbl).where('UID',ipt.uid).select();
}
