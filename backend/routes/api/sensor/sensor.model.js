const knex = require('../knex-mysql.js');
const config = require('../config.js');
const tbl = {
    info: 'USensor',
    type: 'SensorType',
};

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
            });
}

exports.findLogTable = function(ipt) {
    return knex(tbl.type).where('TID',ipt.tid).select('logTableName')
            .then((result) => {
                return result[0].logTableName;
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
