'use strict';

var thunkify = require('thunkify'),
  mysql = require('mysql');

function poolHandle(pool) {
  setInterval(function() {
    pool.query('SELECT 1', function(error) {
      if (error) {
        // handle error
      }
    });
  }, 10 * 1000); // 10 s
}

function createPool(options) {
  var pool = mysql.createPool(options);
  poolHandle(pool);
  return pool;
}

var pool = createPool({
  host: 'localhost',
  port: '3306',
  user: 'test',
  password: 'test',
  database: 'test',
  connectionLimit: 5
});

var query = function(sql, values, cb) {
  if (typeof values === 'function') {
    cb = values;
    values = null;
  }

  pool.query(sql, values, cb);
};

var queryOne = function(sql, values, cb) {
  if (typeof values === 'function') {
    cb = values;
    values = null;
  }

  query(sql, values, function(err, rows) {
    cb(err, rows && rows[0]);
  });
};

var escape = function(value) {
  return pool.escape(value);
};

// exports (note: not export `pool`)
exports.escape = escape;
exports.query = thunkify(query);
exports.queryOne = thunkify(queryOne);
