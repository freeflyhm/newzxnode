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

exports.createCtrl = function (dbHost, dbName) {
  var SetPlace = require('../model').getModel(dbHost, dbName, 'setplace');

  // public method
  var list;

  list = function (obj, callback) {
    SetPlace.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  return {
    list: list,
  };
};
