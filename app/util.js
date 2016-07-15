/*
 * util.js - 公用方法
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

// 首字母大写
exports.replaceFirstUpper = function (str) {
  return str.replace(/(\w)/, function (v) {
    return v.toUpperCase();
  });
};

// 字母或数字组合
exports.validator_alNum = function (str) {
  return /^[a-zA-Z0-9]*$/.test(str);
};

// 必须是中文字符
exports.validator_chineseCharacter = function (str) {
  return /^[\u4E00-\uFA29]*$/.test(str);
};

// 请输入正确的11位手机号
exports.validator_phoneNumber = function (str) {
  return /^1\d{10}$/.test(str);
};
