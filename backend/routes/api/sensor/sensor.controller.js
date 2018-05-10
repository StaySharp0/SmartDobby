const mmnt = require('moment');
const Sensor = require('./sensor.model.js');

/*
    POST /api/sensor/update
    {
      token,
      seonsor id,
      time,
      value
    }
*/

exports.update = async (req, res) => {
  console.log('Api:sensorUpdate');
  //console.log('body',req.body);

  const { body } = req;
  const ipt = {
    sid: body.id,
    time: mmnt(new Date(body.time)).format("YYYY-MM-DD HH:mm:ss"),
    value: body.value,
  };
  
  let info = await Sensor.getInfo(ipt);
  if(!info.status) return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  else info = info.result;

  let tbl = await Sensor.findLogTable(info);
  if(!tbl.status) return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  else tbl = tbl.result;
  
  const create = await Sensor.update(tbl, ipt);
  //console.log('resulte',create);

  if(create.status) {
    res.status(200).json(ApiRes(true, 'US0000', '센서값 업데이트 성공'));
  } else {
    res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패'));
  }
}


exports.createIO = async (req) => {
  console.log('Api.io:sensorCreate');
  console.log('body',req);

  const body = req;
  const ipt = {
    GID: body.gid,
    TID: '',
    name: body.name,
  };

  const tid = await Sensor.findSensorType(body);
  if(!tid.status) return ApiRes(false, 'USR9000', '센서 등록 실패');
  ipt.TID = tid.result;
  const create = await Sensor.create(ipt);
  // console.log(create)
  
  if(create.status) {
    return ApiRes(true, 'USR0000', '센서 등록 성공',{
      '_id': body._id,
      'sensorID': create.result,
    });
  } else {
    return ApiRes(false, 'USR9000', '센서 등록 실패');
  }
}

exports.updateIO = async (req) => {
  console.log('Api.io:sensorUpdate');
  console.log('body',req);

  const body = req;
  const ipt = {
    sid: body.id,
    time: mmnt(new Date(body.time)).format("YYYY-MM-DD HH:mm:ss"),
    value: body.value,
  };
  
  let info = await Sensor.getInfo(ipt);
  if(!info.status) return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  else info = info.result;

  let tbl = await Sensor.findLogTable(info);
  if(!tbl.status) return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  else tbl = tbl.result;

  const create = await Sensor.update(tbl, ipt);

  if(create.status) {
    return ApiRes(true, 'USU0000', '센서값 업데이트 성공');
  } else {
    return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  }
}
