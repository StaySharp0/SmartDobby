const mmnt = require('moment');
const _ = require('lodash');
const Scheduler = require('./scheduler.model');

exports.create = async (req, res) => {
    console.log('Api:schedulerAdd');
    console.log('body',req.body);

    const ipt = {
        UID: req.decoded._id,
        name: req.body.name,
        when: req.body.time,
        what: 'nomal',
        args: JSON.stringify(req.body.params),
        pending: 1,
    };

    // console.log(ipt);
    const create = await Scheduler.create(ipt);
    
    if(create.status) {
        res.status(200).json(ApiRes(true, 'USH0000', '스케줄러 등록 성공'));
    } else {
        res.status(400).json(ApiRes(false, 'USH9000', '스케줄러 등록 실패'));
    } 
}