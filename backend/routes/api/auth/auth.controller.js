const jwt = require('jsonwebtoken');
const User = require('./auth.model.js');

/*
    POST /api/auth/signup
    {
      username,
      password
    }
*/

exports.register = async (req, res) => {
  console.log('Api:signUp');
  console.log('body',req.body);

  const { body } = req;
  const ipt = {
    id: body.id,
    passwd: body.passwd,
    name: body.name,
    problem: body.passwd_problem,
    solution:body.passwd_solution,
  };

  const create = await User.create(ipt);
  // console.log('resulte',create);

  if(create.status) {
    res.status(200).json(ApiRes(true, 'UR0000', '유저등록 성공'));
  } else {
    res.status(400).json(ApiRes(false, 'UR9000', '유저등록 실패', {
      errMessage: User.errCode[create.code],
    }));
  }
}


/*
    POST /api/auth/signin
    {
      username,
      password
    }
*/

const makeJWT = (user, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign({
      _id: user.idx,
      email: user.id,
      name: user.name,
    }, secret, {
      expiresIn: '14d',
      issuer: 'teamback.com',
      subject: 'userInfo'
    }, (err, token) => {
      if (err) reject(err)
      resolve(token) 
    });
  });
};

exports.login = async (req, res) => {
  console.log('Api:signIn');
  console.log('body',req.body);

  const { body } = req;
  const ipt = {
    id: body.id,
    passwd: body.passwd,
  };
  const secret = req.app.get('jwt-secret');
  const user = await User.findOneById(ipt.id);

  if(user.status){
    if(await User.verify(user.data,ipt)) {
      try {
        const jwt = await makeJWT(user.data, secret);
        return res.status(200).json(ApiRes(true, 'UL0000', '유저확인 성공',jwt));
      } catch(e) {}
    }
  }

  return res.status(400).json(ApiRes(false, 'UL9000', '유저확인 실패'));
}


/*
    GET /api/auth/info
    {
      token
    }
*/

exports.info = async (req, res) => {
  return res.status(200).json(ApiRes(false, 'UI0000', '유저 토큰정보 불러오기 성공',req.decoded));
}


/*
    GET /api/auth/refresh
    {
      token
    }
*/
exports.refresh = async (req, res) => {
  const ipt = {
    _id: req.decoded._id,
    email: req.decoded.email,
    name: req.decoded.name,
  };
  const secret = req.app.get('jwt-secret');
  const jwt = await makeJWT(ipt, secret);

  return res.status(200).json(ApiRes(false, 'UR0000', '유저 토큰 재생성 성공',jwt));
}