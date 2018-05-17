const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');
const tbl = {
    gateway: 'UGateway',
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

exports.getInfoList = function(ipt){
    return knex(tbl.info)
            .column('SID',`${tbl.info}.GID`,`${tbl.info}.name`,{'type':`${tbl.type}.name`},'period','dashboard','chart','LogTableName')
            .join(tbl.gateway, `${tbl.gateway}.GID`, `${tbl.info}.GID`)
            .join(tbl.type, `${tbl.info}.TID`, `${tbl.type}.TID`)
            .where(`${tbl.gateway}.UID`,ipt.uid).select()
            .then((result) => {
                return _.map(result, (i) => {
                    return {
                        sid         : i.SID,
                        gid         : i.GID,
                        name        : i.name,
                        type        : i.type,
                        period      : i.period,
                        dashboard   : !!i.dashboard,
                        chart       : !!i.chart,
                        table       : i.LogTableName,
                    }
                })
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

exports.update = function (ltbl, ipt) {
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

exports.getCurrentValues = function(ltbl, ipt) {
    return knex(ltbl).where('SID',ipt.id).select().limit(10).orderBy('idx','desc');
}