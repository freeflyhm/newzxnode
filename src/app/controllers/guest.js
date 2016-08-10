/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * guest controller 模块
 * @module app/controllers/guest
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var Model = require('../model');
  var Guest = Model.getModel(dbHost, dbName, 'guest');

  // private methods
  var _newSave;

  // public methods
  var list;
  var add;
  var update;
  var remove;

  _newSave = function (obj, callback) {
    var newObj = new Guest(obj);

    newObj.save(function (err, res) {
      if (err) {
        return callback({ success: 14000, errMsg: err.message });
      }

      callback({ success: 1, res: res }); // ok
    });
  };

  list = function (obj, callback) {
    Guest.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    Guest.findOne(obj, function (err, res) {
      if (err) {
        return callback({ success: 14003, errMsg: err.message });
      }

      if (res) {
        return callback({ success: 14004, errMsg: '收客单位 - 已存在！' });
      } else {
        // 检验通过，保存
        _newSave(obj, callback);
      }
    });
  };

  update = function (obj, callback) {
    Guest.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, res) {
        if (err) {
          return callback({ success: 14001, errMsg: err.message });
        }

        callback({ success: 1, res: res });
      }
    );
  };

  remove = function (id, callback) {
    Guest.remove({ _id: id }, function (err, isOk) {
      if (err) {
        return callback({ success: 14002, errMsg: err.message });
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
