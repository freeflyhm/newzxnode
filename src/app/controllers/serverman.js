/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * serverman controller 模块
 * @module app/controllers/serverman
 */
'use strict';

exports.createCtrl = function (dbHost, dbName) {
  var ctrlName = 'serverman';
  var Serverman = require('../model').getModel(dbHost, dbName, ctrlName);
  var util = require('../util');
  var errCode;

  // private methods
  var _objSave;
  var _addSave;
  var _updateSave;
  var _findOne;
  var _validator;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _objSave = function (obj, callback) {
    obj.save(function (err, res) {
      if (err) {
        errCode = 11999;
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

  _addSave = function (obj, callback) {
    var newObj = new Serverman(obj);
    _objSave(newObj, callback);
  };

  _updateSave = function (obj, callback) {
    Serverman.findOne({ _id: obj._id }, function (err, res) {
      if (err) {
        errCode = 11996;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({
          success: errCode,
          field: 'name',
          errMsg: err.message,
        });
      }

      res.name = obj.name;

      _objSave(res, callback);
    });
  };

  _findOne = function (obj, save, callback) {
    Serverman.findOne(
      { company: obj.company, name: obj.name },
      function (err, res) {
        if (err) {
          errCode = 11997;
          util.writeLog(ctrlName, errCode, err, obj);
          return callback({
            success: errCode,
            field: 'name',
            errMsg: err.message,
          });
        }

        if (res) {
          return callback({
            success: 11004,
            field: 'name',
            errMsg: '姓名 - 已存在！',
          });
        } else {
          // 检验通过，保存
          save(obj, callback);
        }
      }
    );
  };

  _validator = function (obj) {
    // 检验 obj.name 姓名 isNull、chineseCharacter 自定义验证、isLength
    if (!util.validatorName(obj.name)) {
      return { success: 11014, field: 'name', errMsg: '姓名 - 不合法！' };
    }
  };

  list = function (obj, callback) {
    Serverman.find(obj, function (err, results) {
      if (err) {
        util.writeLog(ctrlName, '11998', err, obj);
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
      _findOne(obj, _addSave, callback);
    }
  };

  update = function (obj, callback) {
    var _verr = _validator(obj);

    if (_verr) {
      callback(_verr);
    } else {
      _findOne(obj, _updateSave, callback);
    }
  };

  remove = function (id, callback) {
    var obj = { _id: id };

    Serverman.remove(obj, function (err, isOk) {
      if (err) {
        errCode = 11995;
        util.writeLog(ctrlName, errCode, err, obj);
        return callback({ success: errCode, errMsg: err.message });
      }

      callback({ success: isOk.result.ok, _id: id });
    });
  };

  return {
    _objSave:_objSave,
    _updateSave: _updateSave,
    _findOne: _findOne,
    list: list,
    add: add,
    update: update,
    remove: remove,
  };
};
