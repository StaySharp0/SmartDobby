const mmnt = require('moment');
const _ = require('lodash');
const Scheduler = require('./scheduler.model');

/**
 * @api {post} /api/scheduler/add Add Scheduler
 * @apiVersion 1.0.0
 * @apiName Add Scheduler
 * @apiGroup scheduler
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {String} name 스케줄 이름
 * @apiParam {String} when cron style 스케줄 타임
 * @apiParam {String} args 센서 조건 Array
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data null
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "USHA0000",
 *       "message": "스케줄러 등록 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "USHA9000",
 *       "message": "스케줄러 등록 실패",
 *       "data": null,
 *     }
 */
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

/**
 * @api {get} /api/scheduler/list List
 * @apiVersion 1.0.0
 * @apiName Scheduler List
 * @apiGroup scheduler
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data Scheduler List Array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "USHL0000",
 *       "message": "스케줄러 리스트 조회 성공",
 *       "data": [{
 *          "idx": Integer,
 *          "UID": Integer,
 *          "name": "4층 피시실 온도 관리",
 *          "when": "0 *\/1 * * * *",
 *          "what": "nomal",
 *          "args": '[{"type":"sensor","sid":Integer},{"type":"value","cond":">=","value":"25"},{"type":"action","rid":Integer}]',
 *          "pending": 1
 *       }],
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "USHL9000",
 *       "message": "스케줄러 리스트 조회 실패",
 *       "data": null,
 *     }
 */
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