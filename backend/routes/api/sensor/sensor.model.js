const knex = require('../knex-mysql.js');
const config = require('../config.js');
const tbl = {
    info: 'USensor',
    type: 'SensorType',
};

exports.create = function(ipt) {
    return knex(tbl.info).insert(ipt)
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

exports.getInfo = function(ipt) {
    return knex(tbl.info).where('SID',ipt.sid).select()
            .then((result) => {
                const i = result[0];

                return {
                    tid         : i.TID,
                    name        : i.name,
                    period      : i.period,
                    dashboard   : !!i.dashboard,
                    chart       : !!i.chart,
                };
            }).catch((err) => {
                return {
                    status: false,
                    code: err.code,
                };
        });
}

exports.findLogTable = function(ipt) {
    return knex(tbl.type).where('TID',ipt.tid).select('logTableName')
            .then((result) => {
                return {
                    status: true,
                    result: result[0].logTableName,
                };
            }).catch((err) => {
                return {
                    status: false,
                    code: err.code,
                };
        });
}

exports.update = function (ltbl,ipt) {
    return knex(ltbl).insert(ipt)
        .then((result) => {
            return {
                status: true,
            };
        })
        .catch((err) => {
            return {
                status: false,
                code: err.code,
            };
        });
};

exports.findSensorType = function(ipt) {
    return knex(tbl.type).where('name',ipt.type).select('TID')
            .then((result) => {
                print(result)
                return {
                    status: false,
                    result: result[0].TID,
                };
            }).catch((err) => {
                return {
                    status: false,
                    code: err.code,
                };
        });
}