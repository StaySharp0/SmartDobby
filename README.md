# SmartDobby
## Backend
1. cd backend
2. npm install
3. vim routes/api/knex-mysql.js
~~~
const knex = require('knex')({
    client: 'mysql',
    database : 'capstone',
    connection: {
      host : 'host address',
      user : 'user',
      password : 'passwd',
      database : 'database', 
  },
});
~~~
4. localhost:3000/api

## Frontend
1. cd frontend
2. npm install
3. npm run build
4. localhost:3000/
