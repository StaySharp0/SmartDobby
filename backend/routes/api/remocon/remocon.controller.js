const mmnt = require('moment');
const _ = require('lodash');
const Remocon = require('./remocon.model.js');


/**
 * @api {get} /api/remocon/list User List
 * @apiVersion 1.0.0
 * @apiName User remocon List
 * @apiGroup remocon
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data Remocon array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "UURL0000",
 *       "message": "유저 리모컨 리스트 조회 성공",
 *       "data": [{ "rid": Number, "name": "remocon name"}]
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UURL9000",
 *       "message": "유저 리모컨 리스트 조회 실패",
 *       "data": null,
 *     }
 */
exports.userList = async (req, res) => {
  console.log('Api:remoconUserList');

  const ipt = {
    UID: req.decoded._id,
  };
  
  const list = await Remocon.getList(ipt);

  if(list.status){
    return res.status(200).json(ApiRes(true, 'UURL0000', '유저 리모컨 리스트 조회 성공', list.result));
  } else {
    return res.status(400).json(ApiRes(false, 'UURL9000', '유저 리모컨 리스트 조회 실패'));
  }
}

/**
 * @api {get} /api/remocon/signal/list List
 * @apiVersion 1.0.0
 * @apiName Remocon List
 * @apiGroup remocon
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {String} search 검색어
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data Remocon signal array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "URL0000",
 *       "message": "리모컨 리스트 조회 성공",
 *       "data": [{ 
 *          "idx": Number, 
 *          "name": "에어컨 전원 ON", 
 *          "model": "Dawon century", 
 *          "signal": "[Numbers]",
 *          "macro": null
 *       }]
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "URL9000",
 *       "message": "리모컨 리스트 조회 실패",
 *       "data": null,
 *     }
 */
exports.signalList = async (req, res) => {
  console.log('Api:remoconSignalList');
  console.log('body',req.query);

  const ipt = {
    search : req.query.search,
  };

  const list = await Remocon.getSignalList(ipt);

  if(list.status){
    return res.status(200).json(ApiRes(true, 'URL0000', '리모컨 리스트 조회 성공', list.result));
  } else {
    return res.status(400).json(ApiRes(false, 'URL9000', '리모컨 리스트 조회 실패'));
  }
}



/**
 * @api {post} /api/remocon/add/legacy Add User Remocon
 * @apiVersion 1.0.0
 * @apiName Add User Remocon
 * @apiGroup remocon
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {Integer} gid Gateway ID
 * @apiParam {Integer} rid Remocon signal ID
 * @apiParam {String} name 유저 리모컨 이름
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
 *       "code": "URAL0000",
 *       "message": "기존 리모컨으로 유저 리모컨 등록 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "URAL9000",
 *       "message": "기존 리모컨으로 유저 리모컨 등록 실패",
 *       "data": null,
 *     }
 */
exports.addLegacy = async (req, res) => {
  console.log('Api:remoconAddLegacy');
  console.log('body',req.body);

  const ipt = {
    UID: req.decoded._id,
    GID: req.body.gid,
    RID: req.body.rid,
    name: req.body.name,
  };
  
  const create = await Remocon.addUserRemocon(ipt);

  if(create.status){
    return res.status(200).json(ApiRes(true, 'URAL0000', '기존 리모컨으로 유저 리모컨 등록 성공'));
  } else {
    return res.status(400).json(ApiRes(false, 'URAL9000', '기존 리모컨으로 유저 리모컨 등록 실패'));
  }
}

/*
    post 
    {
      token,
      { name },
      macro: [rid]
    }
*/
/**
 * @api {post} /api/remocon/add/macro Add Macro
 * @apiVersion 1.0.0
 * @apiName Add Macro
 * @apiGroup remocon
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {Array} macro User Remocon ID Array
 * @apiParam {String} name 유저 리모컨 이름
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
 *       "code": "URAM0000",
 *       "message": "매크로 리모컨 등록 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "URAM9000",
 *       "message": "매크로 리모컨 등록 실패",
 *       "data": null,
 *     }
 */
exports.addMacro = async (req, res) => {
  console.log('Api:remoconAddMacro');
  console.log('body',req.body);

  const ipt = {
    name: req.body.name,
    model: 'macro',
    macro: req.body.macro,
  };
  
  let create = await Remocon.addMacroRemocon(ipt);
  create = await Remocon.addUserRemocon({
    UID: req.decoded._id,
    GID: 1,
    RID: create.result,
    name: ipt.name,
  });

  if(create.status){
    return res.status(200).json(ApiRes(true, 'URAM0000', '매크로 리모컨 등록 성공'));
  } else {
    return res.status(400).json(ApiRes(false, 'URAM9000', '매크로 리모컨 등록 실패'));
  }
}