/* jshint
   node:  true, devel:  true, maxparams: 4, maxstatements: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/**
 * 公共函数模块
 * @module app/util
 */
'use strict';
var validator = require('validator');
var fs = require('fs');
var _logPath = process.cwd() + '/src/log/';

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

var _validatorChineseCharacter =
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
 * 请输入正确的11位手机号
 *
 * @param {Number} num - 数字
 * @returns {Boolean}
 */
exports.validatorPhoneNumber = function (phone) {
  return !!(phone &&
      typeof phone === 'number' &&
      /^1\d{10}$/.test(phone));
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
 * 姓名不合法: 检验 userObj.name 姓名 isNull、chineseCharacter 自定义验证、isLength
 *
 * @param {String} name - 姓名
 * @returns {Boolean}
 */
exports.validatorName = function (name) {
  return !!(name &&
      typeof name === 'string' &&
      _validatorChineseCharacter(name) &&
      validator.isLength(name, 2, 4));
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

/**
 * 公司名不合法: 检验 companyObj.name 公司名称 isNull、isLength
 *
 * @param {String} companyName - 公司名
 * @returns {Boolean}
 */
exports.validatorCompanyName = function (companyName) {
  return !!(companyName &&
        typeof companyName === 'string' &&
        validator.isLength(companyName, 2, 15));
};

/**
 * 公司简称不合法: 检验 userObj.companyAbbr 公司简称 isNull、isLength
 *
 * @param {String} companyAbbr - 公司简称
 * @returns {Boolean}
 */
exports.validatorCompanyAbbr = function (companyAbbr) {
  return !!(companyAbbr &&
        typeof companyAbbr === 'string' &&
        validator.isLength(companyAbbr, 2, 8));
};

exports.writeLog = function (ctrlName, errCode, err, obj) {
  var errorLogfile =
      fs.createWriteStream(_logPath + ctrlName + '.log', { flags: 'a' });
  var meta = '---------------------------------\n' +
      '[' + new Date() + '] write db error ' + errCode + ':\n';

  errorLogfile.write(meta +
      JSON.stringify(err) +
      '\nobj:' + JSON.stringify(obj) + '\n\n');
};
