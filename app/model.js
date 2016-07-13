/*
 * model.js - mongoose model
*/

/* jshint             node:  true,  devel:  true,
   maxstatements: 11, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true */

'use strict';

/* 数据结构
  models = {
    user: {
      hz: Model,
      ...
    },
    ...
  }
*/

var models = {};

var _createModel = function (dbHost, schemaName, dbName) {
  var schemaObj = require('./schemas/' + schemaName);
  var conn = require('./conn');

  // 首字母大写
  var replaceFirstUpper = require('./util').replaceFirstUpper;
  var c = conn.getConn(dbHost, dbName);

  // 首字母大写
  //var USchemaName = schemaName[0].toUpperCase() + schemaName.substr(1);

  return c.model(replaceFirstUpper(schemaName), schemaObj);
};

exports.getModel = function (dbHost, schemaName, dbName) {
  var md;

  if (models[schemaName]) {
    if (models[schemaName][dbName]) {

      return models[schemaName][dbName];
    } else {
      md = _createModel(dbHost, schemaName, dbName);
      models[schemaName][dbName] = md;

      return md;
    }
  } else {
    md = _createModel(dbHost, schemaName, dbName);
    models[schemaName] = {};
    models[schemaName][dbName] = md;

    return md;
  }
};
