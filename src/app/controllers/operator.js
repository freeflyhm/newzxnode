/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * operator controller 模块
 * @module app/controllers/operator
 */
'use strict';

exports.createCtrl = function (dbHost, dbName) {
  var Model = require('../model');
  var Operator = Model.getModel(dbHost, dbName, 'operator');

  // private methods
  var _newSave;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _newSave = function (obj, callback) {
    var newObj = new Operator(obj);

    newObj.save(function (err, res) {
      if (err) {
        return callback({ success: 17000, errMsg: err.message });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    Operator.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    Operator.findOne(obj, function (err, res) {
      if (err) {
        return callback({ success: 17003, errMsg: err.message });
      }

      if (res) {
        return callback({ success: 17004, errMsg: '团队操作人 - 已存在！' });
      } else {
        // 检验通过，保存
        _newSave(obj, callback);
      }
    });
  };

  update = function (obj, callback) {
    Operator.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, res) {
        if (err) {
          return callback({ success: 17001, errMsg: err.message });
        }

        callback({ success: 1, res: res });
      }
    );
  };

  remove = function (id, callback) {
    Operator.remove({ _id: id }, function (err, isOk) {
      if (err) {
        return callback({ success: 17002, errMsg: err.message });
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
