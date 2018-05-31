'use strict';

const scheduler = require('node-schedule');
const _ = require('lodash');

/**
 * Storable Representation of a Scheduled Event
 * 
 * @example
 * var PersistentEvent = require('PersistentEvent'),
 *     knex = require('knex');
 *
 * // assign your persistent storage connection...
 * PersistentEvent.setStore(knex);
 *
 * // load all pending event from persistent storage...
 * PersistentEvent.loadAll$();
 *
 * @param {string|Integer} [_id=-1]
 * @param {string|Integer} name
 * @param {string|Integer} uid
 * @param {string|Date} when
 * @param {string} what
 * @param {array.<string>} [args=[]]
 * @param {boolean} [pending=true]
 *
 * @property {Date} PersistentEvent.when       - the datetime this event should fire.
 * @property {string} PersistentEvent.what     - the name of the action to run (must match key of PersistentEvent.Actions)
 * @property {array} PersistentEvent.args      - args to pass to action event handler.
 * @property {boolean} PersistentEvent.pending - if true, this event has not yet fired.
 *
 * @constructor
 */
let PersistentEvent = function (id, name, uid, when, what, args, pending) {
    // initialize
    PersistentEvent.Cache.push(this.init({
        _id : id,
        name: name,
        uid : uid,
        when: when,
        what: what,
        args: args,
        pending: pending,
    }));
};

  // ==== PersistentEvent Static Methods ====

  /**
   * Pre-defined action event handlers.
   * <p>
   * Where the property key will be used to match the PersistentEvent.what property,
   * and the property value is a event handler function that accepts an optional
   * array of args and a callback (provided by PersistentEvent.prototype.schedule)
   * </p>
   *
   * @property {object}
   * @property {function} Actions.doSomething
   * @property {function} Actions.doSomethingElse
   *
   * @static
   */

  PersistentEvent.Actions = {
    nomal: function (args, cb) {
      console.log('nomal');
      // defaults
      args = args || [];
      // console.log(args);

      // // TODO check specific args here ...

      // var result = true,
      //     err = null;

      // // do your action here, possibly with passed args

      // cb(err, result);
    },
  };

/**
 * Cache of all PersistentEvents
 *
 * @type {Array.<PersistentEvent>}
 * @static
 */
PersistentEvent.Cache = [];

/**
 * Connection to persistent storage.
 * 
 * @property {object}
 * @static
 */
  
PersistentEvent.StorageConnection = null;
PersistentEvent.Table = null;

/**
 * Sets the storage connection used to persist events.
 * 
 * @param {object} storageConnection
 * @static
 */
PersistentEvent.setStore = function (storageConnection, table) {
    PersistentEvent.StorageConnection = storageConnection;
    PersistentEvent.Table = table;
};

/**
 * Saves a PersistentEvent to StorageConnection.
 *
 * @param {PersistentEvent} event - event to save
 * @static
 */
PersistentEvent.save$ = function (event) {
    var conn = PersistentEvent.StorageConnection;

    if (null === conn) {
      throw new Error('requires a StorageConnection');
    }
    console.log(event)

    return conn(PersistentEvent.Table).insert({
        UID : event.uid,
        name : event.name,
        when : event.when, 
        what : event.what, 
        args : JSON.stringify(event.args),
        pending : 1,
    }).then((result) => {
      this._id = result[0];
    });
};

/**
 * Loads all PersistentEvents from StorageConnection.
 * 
 * @static
 */
PersistentEvent.loadAll$ = function () {
    var conn = PersistentEvent.StorageConnection;

    if (null === conn) {
      throw new Error('requires a StorageConnection');
    }

    conn(PersistentEvent.Table).where('pending',1).then((result) => {
      _.forEach(result, (s) => {
        let pending = (s.pending) ? true : false;
        let event = new PersistentEvent(s.idx, s.name, s.UID, s.when, s.what, s.args, pending);
        event.schedule();
      });
    });
    console.log('init: Scheduler load');
};



// ==== PersistentEvent Methods ====

/**
  * Initialize an instance of PersistentEvent.
  *
  * @param {object} opts
  * @return {PersistentEvent}
  */
PersistentEvent.prototype.init = function (opts) {
    // check args
    if ('object' !== typeof opts) {
      throw new Error('opts must be an object');
    }

    // set defaults
    opts._id = opts._id || -1;
    opts.name = opts.name;
    opts.uid = opts.uid;
    opts.args = JSON.parse(opts.args) || [];
    opts.pending = opts.pending && true;

    // check that opts contains needed properties
    if (!opts.when instanceof Date) {
      throw new Error('when must be a string representation of a Date or a Date object');
    }

    console.log(opts.what)
    if ('string' !== typeof opts.what) {
      throw new Error('what must be a string containing an action name');
    }

    if (!Array.isArray(opts.args)) {
      throw new Error('args must be an array');
    }

    if ('boolean' !== typeof opts.pending) {
      throw new Error('pending must be a boolean');
    }

    // set our properties
    var self = this;
    Object.keys(opts).forEach(function (key) {
      if (opts.hasOwnProperty(key)) {
        self[key] = opts[key];
      }
    });

    return this;
};

/**
  * Override for Object.toString()
  * @returns {string}
  */
PersistentEvent.prototype.toString = function () {
    return JSON.stringify(this);
};

/**
  * Schedule the event to run.<br/>
  * <em>Side-effect: saves event to persistent storage.</em>
  */
PersistentEvent.prototype.schedule = function () {
    var self = this,
        handler = PersistentEvent.Actions[this.what];

    if ('function' !== typeof handler) {
      throw new Error('no handler found for action:' + this.what);
    }

    self._event = scheduler.scheduleJob(self.when, function () {
      handler(self.args, function (err, result) {
        if (err) {
            console.error('event ' + self + ' failed:' + err);
        }
      // self.setComplete();
      });
    });
  };

/**
  * Sets this event complete.<br/>
  * <em>Side-effect: saves event to persistent storage.</em>
  */
// PersistentEvent.prototype.setComplete = function () {
//     var self = this;
//     this._event.cancel();
//     this.pending = false;

//     PersistentEvent.save$(this, function (err) {
//         if (err) {
//         console.error('failed to save event ' + self + ' :' + err);
//         }
//     });
// };

exports.PersistentEvent = PersistentEvent;