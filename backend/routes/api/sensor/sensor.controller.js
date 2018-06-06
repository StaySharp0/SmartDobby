const mmnt = require('moment');
const _ = require('lodash');
const Sensor = require('./sensor.model.js');


/**
 * @api {post} /api/sensor/update Update
 * @apiVersion 1.0.0
 * @apiName Update Sensor value
 * @apiGroup sensor
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {String} sid 센서 ID
 * @apiParam {String} time 센서 측정된 시각
 * @apiParam {String} vlaue 센서 값
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
 *       "code": "US0000",
 *       "message": "센서값 업데이트 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-case1:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "US9000",
 *       "message": "센서값 업데이트 실패",
 *       "data": null,
 *     }
 * @apiErrorExample Error-case2:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UR9000",
 *       "message": "센서값 업데이트 실패(부정확한 아이디)",
 *       "data": null,
 *     }
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
  if(!info.status) return res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패(부정확한 센서 아이디)'));
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

/**
 * @api {get} /api/sensor/list List
 * @apiVersion 1.0.0
 * @apiName Sensor List
 * @apiGroup sensor
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data Sensor Array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "USL0000",
 *       "message": "센서 정보리스트 조회 성공",
 *       "data": [{
 *          "sid": Integer,
 *          "gid": Integer,
 *          "name": "2:Temperature",
 *          "type": "temperature",
 *          "period": "30",
 *          "dashboard": true,
 *          "chart": false,
 *          "link": true,
 *          "value": "24",
 *          "history": "2018.06.01 12:44:48"
 *        }],
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "USL9000",
 *       "message": "센서 정보리스트 조회 실패",
 *       "data": null,
 *     }
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
        result.history  = mmnt(val[0].time).format("YYYY.MM.DD HH:mm:ss");
        result.link     = true;
      }
      
      return result;
    }));
    
    return res.status(200).json(ApiRes(true, 'USL0000', '센서 정보리스트 조회 성공', rtn));
  } catch (e) {
    console.log(e)
    return res.status(400).json(ApiRes(false, 'USL9000', '센서 정보리스트 조회 실패'));
  }
}

/**
 * @api {get} /api/sensor/chart Chart Data
 * @apiVersion 1.0.0
 * @apiName Sensor Chart Data
 * @apiGroup sensor
 *
 * @apiParam {String} token 사용자 token
 * @apiParam {String} sid 센서 ID
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data Sensor value Array(length: 10)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "USC0000",
 *       "message": "센서 차트값 조회 성공",
 *       "data": [{
 *          "sid": Integer,
 *          "value": "24",
 *          "time": "2018.06.01 12:44:48"
 *        }, ... 10 ],
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "USC9000",
 *       "message": "센서 차트값 조회 실패",
 *       "data": null,
 *     }
 */
exports.getChartData = async (req, res) => {
  console.log('Api:sensorChartData');
  //console.log('body',req.body);
  
  const ipt = {
    sid: req.query.sid
  };

  let info = await Sensor.getInfo(ipt);
  if(!info.status) return res.status(400).json(ApiRes(false, 'USC9000', '센서 차트값 조회 실패'));
  else info = info.result;

  let tbl = await Sensor.findLogTable(info);
  if(!tbl.status) return res.status(400).json(ApiRes(false, 'USC9000', '센서 차트값 조회 실패'));
  else tbl = tbl.result;

  try {
    const list = await Sensor.getCurrentValues(tbl, {id: ipt.sid});
    
    const rtn = _.map(list, (c) => {
      return {
        time: mmnt(c.time).format("YYYY.MM.DD HH:mm:ss"),
        value: c.value,
      };
    });
    
    return res.status(200).json(ApiRes(true, 'USC0000', '센서 차트값 조회 성공', rtn));
  } catch (e) { 
    return res.status(400).json(ApiRes(false, 'USC0000', '센서 차트값 조회 실패'));
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
  // console.log(req);

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