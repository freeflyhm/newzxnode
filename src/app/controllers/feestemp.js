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
  var Model     = require('../model');
  var FeesTemp  = Model.getModel(dbHost, dbName, 'feestemp');

  var Company   = Model.getModel(dbHost, 'auth', 'company');
};
