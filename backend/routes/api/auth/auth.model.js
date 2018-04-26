const knex = require('../knex-mysql.js');
const crypto = require('crypto');
const config = require('../config.js');
const tbl = 'User';

exports.errCode = {
  'ER_DUP_ENTRY': '이미 등록된 아이디입니다.',
};

exports.create = function (ipt) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(ipt.passwd)
                    .digest('base64');
  ipt.passwd = encrypted;

  return knex(tbl).insert(ipt)
          .then((result) => {
            return {
              status: true,
            };
          })
          .catch((err) => {
            return {
              status: false,
              code: err.code,
            };
          });
};

exports.findOneById = function (id) {
  return knex(tbl).where('id',id).select()
          .then((result) => {
            const rtn = {
              status: false,
            };

            if(result.length === 1){
              rtn.status = true;
              rtn.data = result[0];

              return rtn;
            } else if(result.length === 0) {
              return rtn;
            }
          })
          .catch((err) => {
            return {
              status: false,
              code: err.code,
            };
          });
};

exports.verify = function (user,ipt) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(ipt.passwd)
                    .digest('base64');
  
  return user.passwd === encrypted;
}
