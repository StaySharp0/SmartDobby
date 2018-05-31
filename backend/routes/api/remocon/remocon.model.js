const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');
const tbl = {
    user: 'URemocon',
    signal: 'RemoconSignal',
};

exports.getList = function(ipt) {
    return knex(tbl.user).where('UID', '=', ipt.UID).select()
        .then((result) => {
            return {
                status: true,
                result: _.map(result, (r) => {
                    return {
                        rid: r.idx,
                        name: r.name,
                    };
                }),
            };
        }).catch((err) => {
            return {
                status: false,
                code: err.code,
            };
    });
}

exports.getSignalList = function(ipt) {
    return knex(tbl.signal).select()
        .where((builder) => {
            builder.where('name', 'like', `%${ipt.search}%`)
                .orWhere('model', 'like', `%${ipt.search}%`)
        })
        .andWhere('model', '!=', 'macro')
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
}

exports.addUserRemocon = function(ipt) {
    return knex(tbl.user).insert(ipt)
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
}

exports.addMacroRemocon = function(ipt) {
    return knex(tbl.signal).insert(ipt)
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
}


