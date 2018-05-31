const mmnt = require('moment');
const _ = require('lodash');
const Remocon = require('./remocon.model.js');

/*
    get /api/remocon/list
    { token }
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

/*
    get /api/remocon/signal/list
    { search }
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


/*
    post /api/remocon/add/legacy
    {
      token,
      { gid, rid, name }
    }
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
    return res.status(400).json(ApiRes(false, 'URAL9000', '기존 리모컨으로 유저 리모컨 등록 성공'));
  }
}

/*
    post /api/remocon/add/macro
    {
      token,
      { name },
      macro: [rid]
    }
*/

exports.addMacro = async (req, res) => {
  console.log('Api:remoconAddMacro');
  console.log('body',req.body);

  const ipt = {
    name: req.body.name,
    model: 'macro',
    macro: req.body.macro,
  };
  
  const create = await Remocon.addMacroRemocon(ipt);
  
  if(create.status){
    return res.status(200).json(ApiRes(true, 'URAM0000', '매크로 리모컨 등록 성공'));
  } else {
    return res.status(400).json(ApiRes(false, 'URAM9000', '매크로 리모컨 등록 실패'));
  }
}