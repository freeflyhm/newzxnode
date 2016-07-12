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
var _createConn = function (host, db) {
  return require('mongoose').createConnection(host, db);
};

exports.getConn = function (host, db) {
  var conn;

  if (conns[db]) {
    return conns[db];
  }

  conn = _createConn(host, db);
  conns[db] = conn;
  return conn;
};
