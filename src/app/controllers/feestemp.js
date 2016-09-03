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
  var ctrlName = 'feestemp';
  var getModel = require('../model');
  var FeesTemp = getModel(dbHost, dbName, ctrlName);
  var zxutil   = require('../zxutil');
  var _        = require('underscore');
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
        errCode = '19999';
        zxutil.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
        });
      }

      // res 是 save 成功后的 feestemp 对象
      callback({ success: 1, res: res }); // ok
    });
  };

  /**
   * 获取 集合地点列表
   *
   * @param   {}
   * @returns {Array} - all field
   */
  list = function (obj, callback) {
    FeesTemp.find(obj, function (err, results) {
      if (err) {
        zxutil.writeLog(ctrlName, '19998', err, obj);
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
        errCode = '19997';
        zxutil.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
        });
      }

      var resObj = _.extend(res, obj);

      _objSave(resObj, callback);
    });
  };

  return {
    _objSave: _objSave,
    list:     list,
    add:      add,
    update:   update,
  };
};

module.exports = createCtrl;
