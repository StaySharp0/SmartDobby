const jwt = require('jsonwebtoken');
const User = require('./auth.model.js');

/**
 * @api {post} /api/auth/signup SignUp
 * @apiVersion 1.0.0
 * @apiName SignUp
 * @apiGroup auth
 *
 * @apiParam {String} id 사용자 이메일
 * @apiParam {String} passwd 사용자 비밀번호
 * @apiParam {String} name 사용자 이름
 * @apiParam {String} problem 비밀번호를 찾기 위한 질문
 * @apiParam {String} solution 비밀번호 찾기 질문에 대한 답
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
 *       "code": "UR0000",
 *       "message": "유저등록 성공",
 *       "data": null,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UR9000",
 *       "message": "유저등록 실패",
 *       "data": null,
 *     }
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


/**
 * @api {post} /api/auth/signin SignIn
 * @apiVersion 1.0.0
 * @apiName SignIn
 * @apiGroup auth
 *
 * @apiParam {String} id 사용자 이메일
 * @apiParam {String} passwd 사용자 비밀번호s
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data 사용자 token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "UR0000",
 *       "message": "유저확인 성공",
 *       "data": tejosjoesjfposejfo~,
 *     }
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UR9000",
 *       "message": "유저확인 실패",
 *       "data": null,
 *     }
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



/**
 * @api {get} /api/auth/info Info
 * @apiVersion 1.0.0
 * @apiName info
 * @apiGroup auth
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data 사용자 토큰 정보
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "UI0000",
 *       "message": "유저 토큰정보 불러오기 성공",
 *       "data": {
 *          "_id": Number,
 *          "email": "user email",
 *          "name": "user name",
 *          "iat": Number,
 *          "exp": Number,
 *          "iss": "teamback.com",
 *          "sub": "userInfo"
 *       }
 *     }
 * 
 * @apiErrorExample Error-caes 1:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UL9001",
 *       "message": "만료된 토큰",
 *       "data": null,
 *     }
 
 * @apiErrorExample Error-caes 2: 
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UL9000",
 *       "message": "유저확인 실패",
 *       "data": null,
 *     }
 */
exports.info = async (req, res) => {
  return res.status(200).json(ApiRes(false, 'UI0000', '유저 토큰정보 불러오기 성공',req.decoded));
}


/*
    GET 
    {
      token
    }
*/
/**
 * @api {get} /api/auth/refresh Refresh
 * @apiVersion 1.0.0
 * @apiName refresh
 * @apiGroup auth
 *
 * @apiParam {String} token 사용자 token
 *
 * @apiSuccess {Boolean} status API 응답 성공 여부
 * @apiSuccess {String} code API 응답 코드
 * @apiSuccess {String} message API 요청에 대한 설명
 * @apiSuccess {Object} data 사용자 새로운 토큰 정보
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": true,
 *       "code": "UR0000",
 *       "message": "유저확인 성공",
 *       "data": tejosjoesjfposejfo~,
 *     }
 * 
 * 
 * @apiErrorExample Error-caes 1:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UL9001",
 *       "message": "만료된 토큰",
 *       "data": null,
 *     }
 
 * @apiErrorExample Error-caes 2: 
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "status": false,
 *       "code": "UL9000",
 *       "message": "유저확인 실패",
 *       "data": null,
 *     }
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