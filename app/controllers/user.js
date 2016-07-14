/*
 * user.js - Schema user
*/

/* jshint            node:  true,  devel:  true,
   maxstatements: 13, maxparams: 3, maxdepth: 2,
   maxerr: 50,       nomen: true,  regexp: true */

'use strict';

exports.createCtrl = function (dbHost) {
  var Model = require('../model');
  var User  = Model.getModel(dbHost, 'user', 'auth');
  var _newUserSave;
  var _comparePassword;
  var register;
  var login;
  var _remove;

  // 保存
  _newUserSave = function (userObj, callback) {
    var newUser = new User(userObj);

    newUser.save(function (err, user) {
      if (err) {
        console.log(err.message);
        return callback({ success: 99, errMsg: err.message });
      }

      callback({ success: 1, user: user }); // ok
    });
  };

  _comparePassword = function (user, obj, callback) {
    user.comparePassword(obj.password, function (err, isMatch) {
      if (err) {
        console.log('-----------------------------------------------------------');
        console.log(err);
        return callback({ success: 97, errMsg: err });
      }

      if (isMatch) {
        callback({ success: 1, user: user });
      }
    });
  };

  // register 注册
  register = function (obj, callback) {
    var userObj = obj;

    // 检验 用户 是否存在
    User.findOneByUserName(userObj.userName, function (err, user) {
      if (err) {
        console.log(err.message);
        return callback({ success: 98, errMsg: err.message });
      }

      if (user) {
        return callback({ success: 13 }); // 用户名已存在
      } else {
        // ***所有检验通过，进入正常保存流程***
        _newUserSave(userObj, callback);
      }
    });
  };

  // login 登录
  login = function (obj, callback) {
    User.findOneByUserName(obj.userName, function (err, user) {
      if (err) {
        console.log(err.message);
        return callback({ success: 97, errMsg: err.message });
      }

      // 检查密码
      _comparePassword(user, obj, callback);
    });
  };

  // _remove user 用于测试
  _remove = function (id, callback) {
    if (id) {
      User.remove({ _id: id }, function (err, user) {
        if (err) {
          console.log(err);
        }

        callback({ success: user }); // ok
      });
    }
  };

  return {
    _newUserSave: _newUserSave,         // 用于测试
    _comparePassword: _comparePassword, // 用于测试
    _remove:  _remove,                  // 用于测试
    register: register,
    login: login,
  };
};
