/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * guide controller 模块
 * @module app/controllers/guide
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var Model = require('../model');
  var Guide = Model.getModel(dbHost, dbName, 'guide');

  // private methods
  var _newSave;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _newSave = function (obj, callback) {
    var newObj = new Guide(obj);

    newObj.save(function (err, res) {
      if (err) {
        return callback({ success: 15000, errMsg: err.message });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    Guide.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    Guide.findOne(obj, function (err, res) {
      if (err) {
        return callback({ success: 15003, errMsg: err.message });
      }

      if (res) {
        return callback({ success: 15004, errMsg: '地接人员 - 已存在！' });
      } else {
        // 检验通过，保存
        _newSave(obj, callback);
      }
    });
  };

  update = function (obj, callback) {
    Guide.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, res) {
        if (err) {
          return callback({ success: 15001, errMsg: err.message });
        }

        callback({ success: 1, res: res });
      }
    );
  };

  remove = function (id, callback) {
    Guide.remove({ _id: id }, function (err, isOk) {
      if (err) {
        return callback({ success: 15002, errMsg: err.message });
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

module.exports = createCtrl;
