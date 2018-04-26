const knex = require('knex')({
    client: 'mysql',
    database : 'capstone',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'sS2126',
      database : 'capstone', 
  },
});

module.exports = knex;
