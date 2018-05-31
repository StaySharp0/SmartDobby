const scheduler = require('./scheduler.module').PersistentEvent;
const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');
const tbl = 'Scheduler';

scheduler.setStore(knex, 'Scheduler');
scheduler.loadAll$();

exports.create = (ipt) => {
    let event = new scheduler(-1, ipt.name, ipt.UID, ipt.when, ipt.what, ipt.args, ipt.pending);

    return scheduler.save$(event)
        .then((result) => {
            event.schedule();
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

exports.list = (ipt) => {
    return knex(tbl).where('UID', ipt.UID).select()
        .then((result) => {
            return {
                status: true,
                result: result,
            };
        }).catch((err) => {
            return {
                status: false,
                code: err.code,
            };
    });
};
