/* jshint
   node:  true, devel:  true, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true
 */

/**
 * 公共函数模块
 * @module app/util
 */
'use strict';

var validator = require('validator');

var _validatorAlNum =
  /**
   * 字母或数字组合
   *
   * @alias module:app/util.validatorAlNum
   * @param {String} str - 字符串
   * @returns {Boolean}
   */
  exports.validatorAlNum = function (str) {
    return /^[a-zA-Z0-9]*$/.test(str);
  };

/**
 * 首字母大写
 *
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
exports.validatorReplaceFirstUpper = function (str) {
  return str.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
};

/**
 * 必须是中文字符
 *
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
exports.validatorChineseCharacter = function (str) {
  return /^[\u4E00-\uFA29]*$/.test(str);
};

/**
 * 请输入正确的11位手机号
 *
 * @param {Number} num - 数字
 * @returns {Boolean}
 */
exports.validatorPhoneNumber = function (num) {
  return /^1\d{10}$/.test(num);
};

/**
 * 用户名不合法: 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
 *
 * @param {String} userName - 用户名
 * @returns {Boolean}
 */
exports.validatorUserName = function (userName) {
  return !!(userName &&
      typeof userName === 'string' &&
      _validatorAlNum(userName) &&
      validator.isLength(userName, 2, 15));
};

/**
 * 密码不合法: 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
 *
 * @param {String} password - 密码
 * @param {String} userName - 用户名
 * @returns {Boolean}
 */
exports.validatorPassword = function (password, userName) {
  return !!(password &&
      typeof password === 'string' &&
      validator.isLength(password, 6, 20) &&
      userName !== password);
};
