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

/*
    get /api/gateway/list
    {
      token,
    }
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

/*
    post /api/gateway/name
    {
      gid, name
    }
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