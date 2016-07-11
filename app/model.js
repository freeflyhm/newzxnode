/*
 * model.js - mongoose model
*/

/* jshint             node:  true,  devel:  true,
   maxstatements: 11, maxparams: 2, maxdepth: 2,
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

// 首字母大写
var _replaceFirstUpper = function (str) {
  return str.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
};

var _createModel = function (schemaName, dbName) {
  var schemaObj = require('./schemas/' + schemaName);
  var conn = require('./conn');
  var c = conn.getConn(dbName);

  // 首字母大写
  //var USchemaName = schemaName[0].toUpperCase() + schemaName.substr(1);

  return c.model(_replaceFirstUpper(schemaName), schemaObj);
};

exports.getModel = function (schemaName, dbName) {
  var md;

  if (models[schemaName]) {
    if (models[schemaName][dbName]) {

      return models[schemaName][dbName];
    } else {
      md = _createModel(schemaName, dbName);
      models[schemaName][dbName] = md;

      return md;
    }
  } else {
    md = _createModel(schemaName, dbName);
    models[schemaName] = {};
    models[schemaName][dbName] = md;

    return md;
  }
};
