/*
 * util.js - 公用方法
*/

/* jshint      node:  true, devel:  true, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

var validator = require('validator');

var _validatorAlNum = function (str) {
  return /^[a-zA-Z0-9]*$/.test(str);
};

// 首字母大写
exports.replaceFirstUpper = function (str) {
  return str.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
};

// 字母或数字组合
exports.validator_alNum = _validatorAlNum;

// 必须是中文字符
exports.validator_chineseCharacter = function (str) {
  return /^[\u4E00-\uFA29]*$/.test(str);
};

// 请输入正确的11位手机号
exports.validator_phoneNumber = function (str) {
  return /^1\d{10}$/.test(str);
};

// 用户名不合法
// 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
exports.validator_userName = function (userName) {
  return !!(userName &&
      typeof userName === 'string' &&
      _validatorAlNum(userName) &&
      validator.isLength(userName, 2, 15));
};

// 密码不合法
// 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
exports.validator_password = function (password, userName) {
  return !!(password &&
      typeof password === 'string' &&
      validator.isLength(password, 6, 20) &&
      userName !== password);
};
