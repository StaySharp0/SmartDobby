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
//   console.log('body',req.body);

  const { body } = req;
  const ipt = {
    sid: body.id,
    time: mmnt(new Date(body.time)).format("YYYY-MM-DD HH:mm:ss"),
    value: body.value,
  };
  
  const info = await Sensor.getInfo(ipt);
  const tbl = await Sensor.findLogTable(info);
  const create = await Sensor.update(tbl,ipt);
//   console.log('resulte',create);

  if(create.status) {
    res.status(200).json(ApiRes(true, 'US0000', '센서값 업데이트 성공'));
  } else {
    res.status(400).json(ApiRes(false, 'UR9000', '센서값 업데이트 실패'));
  }
}