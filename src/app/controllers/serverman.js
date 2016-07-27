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
  var Model = require('../model');
  var Serverman = Model.getModel(dbHost, dbName, 'serverman');

  // public method
  var list;
  var add;
  var update;
  var remove;

  list = function (obj, callback) {
    Serverman.find(obj, function (err, results) {
      if (err) {
        return callback([]);
      }

      callback(results);
    });
  };

  add = function (obj, callback) {
    var newServerman = new Serverman(obj);

    newServerman.save(function (err, serverman) {
      if (err) {
        return callback({ success: 11000, errMsg: err.message });
      }

      callback({ success: 1, serverman: serverman }); // ok
    });
  };

  update = function (obj, callback) {
    Serverman.findByIdAndUpdate(
      obj._id,
      { $set: { name: obj.name, 'meta.updateAt': Date.now() } },
      { new: true },
      function (err, serverman) {
        if (err) {
          return callback({ success: 11001, errMsg: err.message });
        }

        callback({ success: 1, serverman: serverman });
      }
    );
  };

  remove = function (_id, callback) {
    Serverman.remove({ _id: _id }, function (err, isOk) {
      if (err) {
        return callback({ success: 11002, errMsg: err.message });
      }

      callback({ success: isOk.result.ok, _id: _id });
    });
  };

  return {
    list: list,
    add: add,
    update: update,
    remove: remove,
  };
};
