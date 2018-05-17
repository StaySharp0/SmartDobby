const _ = require('lodash');
const mmnt = require('moment');

const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');

const Sensor = require('../sensor/sensor.model');
const Gateway = require('../gateway/gateway.model');

router.use('/', authMiddleware.check);
router.get('/mypage', async (req, res) => {
  console.log('APIpage: mypage');
  
  const ipt = {
    uid: req.decoded._id
  };
    
  try {
    let gatewayInfo = await Gateway.getList(ipt);
    let sensorInfo = await Sensor.getInfoList(ipt);

    sensorInfo = await Promise.all(_.map(sensorInfo, async(i) => { 
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

    sensorInfo = _.groupBy(sensorInfo,(o) => o.gid);
  
    let rtn = _.map(gatewayInfo, (g) => {
      return {
        id: g.GID,
        name: g.name,
        sensor: sensorInfo[g.GID],
      };
    });
    
    return res.status(200).json(ApiRes(true, 'PG-MYPAGE-0000', '마이페이지 성공', rtn));
  } catch (e) {
    console.log(e)
    return res.status(400).json(ApiRes(true, 'PG-MYPAGE-9000', '마이페이지 실패'));
  }
});

router.get('/dashboard', async (req, res) => {
  console.log('APIpage: dashboard');
  
  const ipt = {
    uid: req.decoded._id
  };
    
  try {
    let gatewayInfo = await Gateway.getList(ipt);
    let sensorInfo = await Sensor.getInfoList(ipt);

    sensorInfo = await Promise.all(_.map(sensorInfo, async(i) => { 
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

    sensorInfo = _.groupBy(sensorInfo,(o) => o.gid);
  
    let rtn = _.map(gatewayInfo, (g) => {
      return {
        id: g.GID,
        name: g.name,
        sensor: sensorInfo[g.GID],
      };
    });
    
    return res.status(200).json(ApiRes(true, 'PG-DashBoard-0000', '데시보드 성공', rtn));
  } catch (e) {
    console.log(e)
    return res.status(400).json(ApiRes(true, 'PG-DashBoard-9000', '데시보드 실패'));
  }
});

exports.router = router;