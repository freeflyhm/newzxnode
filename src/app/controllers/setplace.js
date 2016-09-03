/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * feestemp controller 模块
 * @module app/controllers/feestemp
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var SetPlace = require('../model')(dbHost, dbName, 'setplace');
  var writeLog = require('../zxutil').writeLog;

  // public method
  var list;

  /**
   * 获取 集合地点列表
   *
   * @param   {}
   * @returns {Array} - all field
   */
  list = function (obj, callback) {
    SetPlace.find(obj, function (err, results) {
      if (err) {
        writeLog('setplace', '18999', err, obj);
        return callback([]);
      }

      callback(results);
    });
  };

  return {
    list: list,
  };
};

module.exports = createCtrl;
