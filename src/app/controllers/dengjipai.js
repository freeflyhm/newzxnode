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

exports.createCtrl = function (dbHost, dbName) {
  var Model = require('../model');
  var Dengjipai = Model.getModel(dbHost, dbName, 'dengjipai');

  // private methods
  var _newSave;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _newSave = function (obj, callback) {
    var newObj = new Dengjipai(obj);

    newObj.save(function (err, res) {
      if (err) {
        return callback({ success: 12000, errMsg: err.message });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    Dengjipai.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    Dengjipai.findOne(obj, function (err, res) {
      if (err) {
        return callback({ success: 12003, errMsg: err.message });
      }

      if (res) {
        return callback({ success: 12004, errMsg: '用户 - 已存在！' });
      } else {
        // 检验通过，保存
        _newSave(obj, callback);
      }
    });
  };

  update = function (obj, callback) {
    Dengjipai.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, res) {
        if (err) {
          return callback({ success: 12001, errMsg: err.message });
        }

        callback({ success: 1, res: res });
      }
    );
  };

  remove = function (id, callback) {
    Dengjipai.remove({ _id: id }, function (err, isOk) {
      if (err) {
        return callback({ success: 12002, errMsg: err.message });
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
