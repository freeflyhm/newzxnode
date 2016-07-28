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
  var writeLog = require('../util').writeLog;
  var errCode;

  // private methods
  var _newSave;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _newSave = function (obj, callback) {
    var newObj = new Serverman(obj);

    newObj.save(function (err, res) {
      if (err) {
        errCode = 11999;
        writeLog(ctrlName, errCode, err, obj);
        return callback({ success: errCode, errMsg: err.message });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    Serverman.find(obj, function (err, results) {
      if (err) {
        writeLog(ctrlName, '11998', err, obj);
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    Serverman.findOne(obj, function (err, res) {
      if (err) {
        errCode = 11997;
        writeLog(ctrlName, errCode, err, obj);
        return callback({ success: errCode, errMsg: err.message });
      }

      if (res) {
        return callback({ success: 11004, errMsg: '姓名 - 已存在！' });
      } else {
        // 检验通过，保存
        _newSave(obj, callback);
      }
    });
  };

  update = function (obj, callback) {
    Serverman.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, res) {
        if (err) {
          errCode = 11996;
          writeLog(ctrlName, errCode, err, obj);
          return callback({ success: errCode, errMsg: err.message });
        }

        callback({ success: 1, res: res });
      }
    );
  };

  remove = function (id, callback) {
    var obj = { _id: id };

    Serverman.remove(obj, function (err, isOk) {
      if (err) {
        errCode = 11995;
        writeLog(ctrlName, errCode, err, obj);
        return callback({ success: errCode, errMsg: err.message });
      }

      callback({ success: isOk.result.ok, _id: id });
    });
  };

  return {
    _newSave: _newSave,
    list: list,
    add: add,
    update: update,
    remove: remove,
  };
};
