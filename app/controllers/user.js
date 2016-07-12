/*
 * user.js - Schema user
*/

/* jshint      node:  true, devel:  true, maxstatements: 9, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

exports.createCtrl = function (host) {
  var Model = require('../model');
  var User  = Model.getModel(host, 'user', 'auth');
  var register;
  var remove;

  // register 注册
  register = function (obj, callback) {
    var userObj = obj;

    // 检验 用户 是否存在
    User.findOneByUserName(userObj.userName, function (err, user) {
      var newUser;

      if (err) {
        console.log(err);
      }

      if (user) {
        callback({ success: 13 }); // 用户名已存在
        return;
      } else {
        // ***所有检验通过，进入正常保存流程***
        newUser = new User(userObj);
        newUser.save(function (err, user) {
          if (err) {
            console.log(err);
          }

          if (user) {
            callback({ success: 1, user: user }); // ok
            return;
          }
        });
      }
    });
  };

  // remove user
  remove = function (id, callback) {
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
    register: register,
    remove:  remove,
  };
};
