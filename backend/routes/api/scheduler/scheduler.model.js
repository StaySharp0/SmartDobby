const scheduler = require('./scheduler.module').PersistentEvent;
const knex = require('../knex-mysql.js');
const config = require('../config.js');
const _ = require('lodash');

scheduler.setStore(knex, 'Scheduler');
scheduler.loadAll$();
