/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * dengjipai controller 模块
 * @module app/controllers/dengjipai
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var ctrlName = 'dengjipai';
  var Dengjipai = require('../model')(dbHost, dbName, ctrlName);
  var util = require('../util');
  var errCode;

  // private methods
  var _objSave;
  var _addSave;
  var _findOneById;
  var _updateSave;
  var _findOneByName;
  var _validator;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _objSave = function (obj, callback) {
    obj.save(function (err, res) {
      if (err) {
        errCode = 12999;
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

  _addSave = function (res, obj, callback) {
    var newObj;

    if (res) {
      return callback({
        success: 12004,
        field: 'name',
        errMsg: '用户 - 已存在！',
      });
    } else {
      // 检验通过，保存
      newObj = new Dengjipai(obj);
      _objSave(newObj, callback);
    }
  };

  _findOneById = function (obj, callback) {
    Dengjipai.findOne({ _id: obj._id }, function (err, res) {
      if (err) {
        errCode = 12996;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
          field: 'name',
          errMsg: err.message,
        });
      }

      res.name = obj.name;
      res.password = obj.password;

      _objSave(res, callback);
    });
  };

  _updateSave = function (res, obj, callback) {
    if (res) {
      if (res._id.toString() === obj._id.toString()) {
        res.password = obj.password;

        _objSave(res, callback);
      } else {
        return callback({
          success: 12005,
          field: 'name',
          errMsg: '用户 - 已存在！',
        });
      }
    } else {
      _findOneById(obj, callback);
    }
  };

  _findOneByName = function (obj, save, callback) {
    Dengjipai.findOne({ name: obj.name }, function (err, res) {
      if (err) {
        errCode = 12997;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
          field: 'name',
          errMsg: err.message,
        });
      }

      save(res, obj, callback);
    });
  };

  _validator = function (obj) {
    // 检验 obj.name 用户 isNull、chineseCharacter 自定义验证、isLength
    if (!util.validatorName(obj.name)) {
      return { success: 12014, field: 'name', errMsg: '用户 - 不合法！' };
    }

    // 检验 obj.password 密码 isNull、isLength、用户名与密码相同
    if (!util.validatorPassword(obj.password)) {
      return {
        success: 12015,
        field: 'password',
        errMsg: '密码 - 不合法！',
      };
    }

    return null;
  };

  list = function (obj, callback) {
    Dengjipai.find(obj, function (err, results) {
      if (err) {
        util.writeLog(ctrlName, '12998', err, obj);
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    var _verr = _validator(obj);

    if (_verr) {
      callback(_verr);
    } else {
      _findOneByName(obj, _addSave, callback);
    }
  };

  update = function (obj, callback) {
    var _verr = _validator(obj);

    if (_verr) {
      callback(_verr);
    } else {
      _findOneByName(obj, _updateSave, callback);
    }
  };

  remove = function (id, callback) {
    var obj = { _id: id };

    Dengjipai.remove(obj, function (err, isOk) {
      if (err) {
        errCode = 12995;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({ success: errCode, errMsg: err.message });
      }

      callback({ success: isOk.result.ok, _id: id });
    });
  };

  return {
    _objSave: _objSave,
    _findOneById: _findOneById,
    _findOneByName: _findOneByName,
    list: list,
    add: add,
    update: update,
    remove: remove,
  };
};

module.exports = createCtrl;
