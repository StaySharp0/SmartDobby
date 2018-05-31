const mmnt = require('moment');
const _ = require('lodash');
const Scheduler = require('./scheduler.model');

exports.create = async (req, res) => {
    console.log('Api:schedulerAdd');
    // console.log('body',req.body);

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
        res.status(200).json(ApiRes(true, 'USHA0000', '스케줄러 등록 성공'));
    } else {
        res.status(400).json(ApiRes(false, 'USHA9000', '스케줄러 등록 실패'));
    } 
}

exports.list = async (req, res) => {
    console.log('Api:schedulerList');
    // console.log('body',req.body);

    const ipt = {
        UID: req.decoded._id,
    };

    const list = await Scheduler.list(ipt);
    
    if(list.status) {
        res.status(200).json(ApiRes(true, 'USHL0000', '스케줄러 리스트 조회 성공', list.result));
    } else {
        res.status(400).json(ApiRes(false, 'USHL9000', '스케줄러 리스트 조회 실패'));
    } 
}