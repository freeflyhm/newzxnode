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
  var ctrlName = 'feestemp';
  var Model = require('../model');
  var FeesTemp = Model.getModel(dbHost, dbName, ctrlName);
  var util = require('../util');
  var _ = require('underscore');
  var errCode;

  // private methods
  var _objSave;

  // public method
  var list;
  var add;
  var update;

  _objSave = function (obj, callback) {
    obj.save(function (err, res) {
      if (err) {
        errCode = 19999;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
          field: 'name',
          errMsg: err.message,
        });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    FeesTemp.find(obj, function (err, results) {
      if (err) {
        util.writeLog(ctrlName, '19998', err, obj);
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    var newObj = new FeesTemp(obj);
    _objSave(newObj, callback);
  };

  update = function (obj, callback) {
    FeesTemp.findOne({ _id: obj._id }, function (err, res) {
      if (err) {
        errCode = 19996;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
          field: 'name',
          errMsg: err.message,
        });
      }

      var resObj = _.extend(res, obj);

      _objSave(resObj, callback);
    });
  };

  return {
    _objSave: _objSave,
    list: list,
    add: add,
    update: update,
  };
};
