const mmnt = require('moment');
const _ = require('lodash');
const Gateway = require('./gateway.model.js');

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