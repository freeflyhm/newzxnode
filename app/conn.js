/*
 * conn.js - 数据库连接
*/

/* jshint      node:  true, devel:  true, maxstatements: 8, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

/* 数据结构
  conns = {
    hz: mongoose.connection,
    ...
  }
*/

var conns = {};
var _createConn = function (dbHost, db) {
  return require('mongoose').createConnection(dbHost, db);
};

exports.getConn = function (dbHost, db) {
  var conn;

  if (conns[db]) {
    return conns[db];
  }

  conn = _createConn(dbHost, db);
  conns[db] = conn;
  return conn;
};
