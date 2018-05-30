const mmnt = require('moment');
const _ = require('lodash');
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
  if(!info.status) return res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패'));
  else info = info.result;

  let tbl = await Sensor.findLogTable(info);
  if(!tbl.status) return res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패'));
  else tbl = tbl.result;
  
  const create = await Sensor.update(tbl, ipt);
  //console.log('resulte',create);

  if(create.status) {
    res.status(200).json(ApiRes(true, 'US0000', '센서값 업데이트 성공'));
  } else {
    res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패'));
  }
}

/*
    POST /api/sensor/list
    {
      token,
    }
*/
exports.list = async (req, res) => {
  console.log('Api:sensorList');
  //console.log('body',req.body);
  
  const ipt = {
    uid: req.decoded._id
  };
  try {
    let sensorList = await Sensor.getInfoList(ipt);

    let rtn = await Promise.all(_.map(sensorList, async(i) => { 
      let val = await Sensor.getCurrentValues(i.table, {id: i.sid});
      let result = _.omit(i,['table']);

      // 주기로 link가 제대로 동작하는지 확인하는 롲기 들어가야함
      result.link = false;
      if (val.length > 0){
        result.value    = val[0].value;
        result.history  = mmnt(val.time).format("YYYY.MM.DD HH:mm:ss");
        result.link     = true;
      }
      
      return result;
    }));
    
    return res.status(200).json(ApiRes(true, 'US0000', '센서 정보리스트 조회 성공', rtn));
  } catch (e) {
    console.log(e)
    return res.status(400).json(ApiRes(false, 'USU9000', '센서 정보리스트 조회 실패'));
  }
}

/*
    IO req/sensor/create
    {
      token,
      _id: sensor id in gateway,
      gid: gateway ID,
      type: sensor type,
      name: default sensor name,
    }
    Complete
*/
exports.createIO = async (req) => {
  console.log('Api.io:sensorCreate');
  console.log('body',req);

  const ipt = {
    GID: req.gid,
    TID: '',
    name: req.name,
  };

  const tid = await Sensor.findSensorType({type:req.type});
  if(!tid.status) return ApiRes(false, 'USR9001', '센서 등록 실패(정확하지 않은 센서 타입)');
  ipt.TID = tid.result;
  const create = await Sensor.create(ipt);
  // console.log(create)
  
  if(create.status) {
    return ApiRes(true, 'USR0000', '센서 등록 성공',{
      '_id': req._id,
      'sensorID': create.result,
    });
  } else {
    return ApiRes(false, 'USR9000', '센서 등록 실패');
  }
}

/*
    IO req/sensor/update
    {
      sid: sensor ID,
      { time },
      { value },
    }
*/
exports.updateIO = async (req) => {
  console.log('Api.io:sensorUpdate');
  console.log(req);

  const ipt = {
    sid: req.sid,
    time: mmnt(new Date(req.time)).format("YYYY-MM-DD HH:mm:ss"),
    value: req.value,
  };
  
  let info = await Sensor.getInfo(ipt);
  if(!info.status) return ApiRes(false, 'USU9001', '센서값 업데이트 실패(부정확한 센서 아이디)');
  else info = info.result;

  let tbl = await Sensor.findLogTable(info);
  if(!tbl.status) return ApiRes(false, 'USU9002', '센서값 업데이트 실패(부정확한 센서 타입)');
  else tbl = tbl.result;

  const create = await Sensor.update(tbl, ipt);

  if(create.status) {
    return ApiRes(true, 'USU0000', '센서값 업데이트 성공');
  } else {
    return ApiRes(false, 'USU9000', '센서값 업데이트 실패');
  }
}

/*
    IO req/sensor/info/update
    {
      { 'sid', 'name', 'period', 'chart', 'dashboard' }
    }
*/

exports.updateInfoIO = async (req) => {
  console.log('Api.io:sensorInfoUpdate');
  console.log(req);

  if(!_.isUndefined(req.chart)) req.chart = (req.chart) ? 1:0;
  if(!_.isUndefined(req.dashboard)) req.dashboard = (req.dashboard) ? 1:0;

  return await Sensor.updateInfo(req);
}