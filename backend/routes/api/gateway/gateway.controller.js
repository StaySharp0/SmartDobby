const mmnt = require('moment');
const _ = require('lodash');
const Gateway = require('./gateway.model.js');

/*
    IO req/gatway/create
    {
      token,
      name: default gateway name,
      mac_addr: gateway mac address,
    }
*/
exports.create = async (req, jwt) => {
  const ipt = {
    UID: jwt._id,
    name: req.name,
    MAC: req.mac_addr,
  };
  
  const create = await Gateway.createGateway(ipt);
  console.log('resulte',create);

  if(create.status){
    return ApiRes(true, 'UR0000', '유저 게이트웨이 등록 성공',{
      'gatewayID': create.result,
    });
  } else {
    return ApiRes(false, 'UR9000', '유저 게이트웨이 등록 실패', {
      errMessage: User.errCode[create.code],
    });
  }
}


/**
 * @api {get} /api/gateway/list list
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup gateway
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data gateway Array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "UG0000",
 *       "message": "게이트웨이 정보리스트 조회 성공",
 *       "data": [{ "gid": Number, "name": "default gateway"}]
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UR9000",
 *       "message": "게이트웨이 정보리스트 조회 실패",
 *       "data": null,
 *     }
 */
exports.list = async (req, res) => {
  console.log('Api:gatewayList');

  const ipt = {
    uid: req.decoded._id
  };

  try {
    let rtn = await Gateway.getList(ipt);
    rtn = _.map(rtn, (i) => {
      return {
        gid: i.GID,
        name: i.name,
      };
    });

    return res.status(200).json(ApiRes(true, 'UG0000', '게이트웨이 정보리스트 조회 성공', rtn));

  } catch (error) {
    return res.status(400).json(ApiRes(false, 'UG9000', '게이트웨이 정보리스트 조회 실패'));
  }
}

/**
 * @api {post} /api/gateway/name Change Name
 * @apiVersion 1.0.0
 * @apiName Chagen Name
 * @apiGroup gateway
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {Integer} gateway ID
 * @apiParam {String} gateway 이름
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
 *       "code": "UGUN0000",
 *       "message": "유저 게이트웨이 이름 변경 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UGUN9000",
 *       "message": "유저 게이트웨이 이름 변경 실패",
 *       "data": null,
 *     }
 */
exports.updateName = async (req, res) => {
  console.log('Api:updateGatewayName');
  // console.log(req.body);

  const ipt = {
    gid: req.body.gid,
    name: req.body.name,
  };

  const update = await Gateway.updateName(ipt);

  console.log(update);
  if(update.status){
    return res.status(200).json(ApiRes(true, 'UGUN0000', '유저 게이트웨이 이름 변경 성공'));
  } else {
    return res.status(200).json(ApiRes(false, 'UGUN9000', '유저 게이트웨이 이름 변경 실패', {
      errMessage: User.errCode[create.code],
    }));
  }
  
}