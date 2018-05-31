const scheduler = require('./scheduler.module').PersistentEvent;
const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');
const tbl = 'Scheduler';

scheduler.setStore(knex, 'Scheduler');
scheduler.loadAll$();

exports.create = (ipt) => {
    return knex(tbl).insert(ipt)
        .then((result) => {
            return {
                status: true,
            };
        }).catch((err) => {
            return {
                status: false,
                code: err.code,
            };
    });
};
