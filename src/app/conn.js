/**
 * 数据库连接模块
 * @module app/conn
 */

/* jshint
   node:  true, devel:  true, maxstatements: 8, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true
 */

'use strict';

/**
 * 存放所有数据库连接 key-value 结构，通过数据库名称获取连接
 *
 * @type {object}
 * @property {connection} auth  - key:数据库名称, value: 数据库连接
 * @property {connection} sz
 * @property {connection} gz
 * @property {connection} hz
 * @property {connection} ...
 */

/*
   数据库名称: auth, sz, gz, hz
   数据结构
   conns = {
     hz: mongoose.connection,
     ...
   }
 */

var conns = {};

/**
 * 创建数据库连接
 *
 * @param {String} dbHost    数据库主机
 * @param {String} dbName    数据库名称
 * @returns {connection} 数据库连接
 */
var _createConn = function (dbHost, dbName) {
  return require('mongoose').createConnection(dbHost, dbName);
};

/**
 * 获取数据库连接
 *
 * @param {String} dbHost    数据库主机
 * @param {String} dbName    数据库名称
 * @returns {connection} 数据库连接
 */
exports.getConn = function (dbHost, dbName) {
  var conn;

  if (conns[dbName]) {
    return conns[dbName];
  }

  conn = _createConn(dbHost, dbName);
  conns[dbName] = conn;
  return conn;
};
