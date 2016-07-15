/*
 * user.js - Schema user
*/

/* jshint            node:  true,  devel:  true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,       nomen: true,  regexp: true */

'use strict';

exports.createCtrl = function (dbHost, dbName) {
  var validator = require('validator');
  var _         = require('underscore');
  var Model     = require('../model');
  var util      = require('../util');
  var User      = Model.getModel(dbHost, 'auth', 'user');
  var Company   = Model.getModel(dbHost, 'auth', 'company');
  var FeesTemp  = Model.getModel(dbHost, dbName, 'feestemp');
  var _removeUser;
  var _remove;
  var _companyFindOneByName;
  var _userFindOneByUserName;
  var _newCompanySave;
  var _newUserSave;
  var _comparePassword;
  var _userFindOneInLogin;
  var register;
  var login;

  _removeUser = function (uid, ok, callback) {
    User.remove({ _id: uid }, function (err, user) {
      if (err) {
        return callback({ success: 10000, errMsg: err.message });
      }

      callback({ success: user.result.ok * ok }); // ok
    });
  };

  // _remove company user 用于测试
  _remove = function (cid, uid, callback) {
    if (cid && uid) {
      Company.remove({ _id: cid }, function (err, company) {
        if (err) {
          return callback({ success: 10001, errMsg: err.message });
        }

        _removeUser(uid, company.result.ok, callback);
      });
    } else {
      callback({ success: 10002, errMsg: 'checked cid && uid, joe' });
    }
  };

  _companyFindOneByName = function (companyObj, userObj, callback) {
    Company.findOneByName(companyObj.name, function (err, company) {
      if (err) {
        return callback({ success: 10003, errMsg: err.message });
      }

      if (company) {
        return callback({ success: 10004, errMsg: '公司名已存在' });
      } else {
        // 检验 用户 是否存在
        _userFindOneByUserName(companyObj, userObj, callback);
      }
    });
  };

  // 检验 用户 是否存在
  _userFindOneByUserName = function (companyObj, userObj, callback) {
    User.findOneByUserName(userObj.userName, function (err, user) {
      if (err) {
        return callback({ success: 10005, errMsg: err.message });
      }

      if (user) {
        return callback({ success: 10006, errMsg: '用户名已存在' });
      } else {
        // ***所有检验通过，进入正常保存流程***
        // 保存公司
        companyObj.feestemp = '默认';
        _newCompanySave(companyObj, userObj, callback);
      }
    });
  };

  // 保存新公司
  _newCompanySave = function (companyObj, userObj, callback) {
    var newCompany = new Company(companyObj);

    newCompany.save(function (err, company) {
      if (err) {
        return callback({ success: 10007, errMsg: err.message });
      }

      // 添加公司 总负责人，用户权限：30
      userObj.role = 30;
      userObj.status = false; // false：审核中（主账户注册后需要管理员审核）
      userObj.company = company._id;

      _newUserSave(userObj, callback);
    });
  };

  // 保存新用户 30权限
  _newUserSave = function (userObj, callback) {
    var newUser = new User(userObj);

    newUser.save(function (err, user) {
      if (err) {
        return callback({ success: 10008, errMsg: err.message });
      }

      callback({ success: 1, user: user }); // ok
    });
  };

  _comparePassword = function (user, obj, callback) {
    user.comparePassword(obj.password, function (err, isMatch) {
      if (err) {
        return callback({ success: 10009, errMsg: err });
      }

      if (isMatch) { // true
        callback({ success: 1, user: user });
      } else {
        callback({ success: 10016, errMsg: '密码错误' });
      }
    });
  };

  _userFindOneInLogin = function (obj, callback) {
    User.findOne({ userName: obj.userName })
        .populate('company', { category: 1, feestemp: 1, city: 1 })
        .exec(function (err, user) {
          if (err) {
            return callback({ success: 10019, errMsg: err.message });
          }

          //console.log(user);
          if (user) {
            if (user.role === 0) {
              return callback({ success: 10020, errMsg: '禁止登录' });
            } else if (user.role <= 30 &&
                user.company.category === 30 &&
                user.company.city !== obj.city) {

              return callback({ success: 10021, errMsg: '禁止登录此城市' });
            }

            // // 检查用户状态
            // if (user.status === false) {
            //   return callback({ success: 10022, errMsg: '账号审核中' });
            // }

            // 检查密码
            _comparePassword(user, obj, callback);
          } else {
            callback({ success: 10023, errMsg: '不存在此用户' });
          }
        }
    );
  };

  // register 注册
  register = function (obj, callback) {
    // success:10004 - 公司名已存在
    // success:10006 - 用户名已存在
    // success:10010 - 公司名不合法
    // success:10011 - 用户名不合法
    // success:10012 - 密码不合法
    // success:10013 - 公司简称不合法
    // success:10014 - 姓名不合法
    // success:10015 - 手机号不合法
    // success:10016 - 密码错误

    var companyObj = obj.companyObj;
    var userObj = obj.userObj;

    // 检验 companyObj.name 公司名称 isNull、isLength
    if (!(companyObj.name &&
        typeof companyObj.name === 'string' &&
        validator.isLength(companyObj.name, 2, 15))) {

      return callback({ success: 10010, errMsg: '公司名不合法' });
    }

    // 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
    if (!util.validator_userName(userObj.userName)) {
      return callback({ success: 10011, errMsg: '用户名不合法' });
    }

    // if (!(userObj.userName &&
    //     util.validator_alNum(userObj.userName) &&
    //     validator.isLength(userObj.userName, 2, 15))) {

    //   return callback({ success: 10011, errMsg: '用户名不合法' });
    // }

    // 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
    if (!util.validator_password(userObj.password, userObj.userName)) {
      return callback({ success: 10012, errMsg: '密码不合法' });
    }

    // if (!(userObj.password &&
    //     typeof userObj.password === 'string' &&
    //     validator.isLength(userObj.password, 6, 20) &&
    //     userObj.userName !== userObj.password)) {

    //   return callback({ success: 10012, errMsg: '密码不合法' });
    // }

    // 检验 userObj.companyAbbr 公司简称 isNull、isLength
    if (!(userObj.companyAbbr &&
        typeof userObj.companyAbbr === 'string' &&
        validator.isLength(userObj.companyAbbr, 2, 8))) {

      return callback({ success: 10013, errMsg: '公司简称不合法' });
    }

    // 检验 userObj.name 姓名 isNull、chineseCharacter 自定义验证、isLength
    if (!(userObj.name &&
        util.validator_chineseCharacter(userObj.name) &&
        validator.isLength(userObj.name, 2, 4))) {

      return callback({ success: 10014, errMsg: '姓名不合法' });
    }

    // 检验 userObj.phone 手机号 isNull、phoneNumber 自定义验证
    if (!(userObj.phone &&
        typeof userObj.phone === 'number' &&
        util.validator_phoneNumber(userObj.phone))) {
      return callback({ success: 10015, errMsg: '手机号不合法' });
    }

    // 检验 公司 是否存在
    _companyFindOneByName(companyObj, userObj, callback);
  };

  // login 登录
  login = function (obj, callback) {
    // success:10017 - 用户名不合法
    // success:10018 - 密码不合法
    // success:18 - 用户名不存在
    // success:19 - 禁止登录
    // success:20 - 密码错误
    // success:21 - 账号审核中...
    // success:29 - 城市不合法...

    // 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
    if (!util.validator_userName(obj.userName)) {
      return callback({ success: 10017, errMsg: '用户名不合法' });
    }

    // 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
    if (!util.validator_password(obj.password, obj.userName)) {
      return callback({ success: 10018, errMsg: '密码不合法' });
    }

    _userFindOneInLogin(obj, callback);

    // User.findOneByUserName(obj.userName, function (err, user) {
    //   if (err) {
    //     return callback({ success: 96, errMsg: err.message });
    //   }

    //   // 检查密码
    //   _comparePassword(user, obj, callback);
    // });
  };

  return {
    _removeUser:            _removeUser,            // 用于测试
    _remove:                _remove,                // 用于测试
    _companyFindOneByName:  _companyFindOneByName,  // 用于测试
    _userFindOneByUserName: _userFindOneByUserName, // 用于测试
    _newCompanySave:        _newCompanySave,        // 用于测试
    _newUserSave:           _newUserSave,           // 用于测试
    _comparePassword:       _comparePassword,       // 用于测试
    _userFindOneInLogin:    _userFindOneInLogin,    // 用于测试
    register:               register,
    login:                  login,
  };
};