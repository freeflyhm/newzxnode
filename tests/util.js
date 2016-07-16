/* jshint
   node: true, devel: true, maxstatements: 8,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it */

/* util.js - Mocha util test */
'use strict';

describe('util.js', function () {
  var assert = require('assert');
  var Util = require('../src/app/util');

  // 首字母大写
  describe('validatorReplaceFirstUpper', function () {
    it('should as Should', function () {
      assert.strictEqual(Util.validatorReplaceFirstUpper('should'), 'Should');
    });
  });

  // 字母或数字组合
  describe('validatorAlNum', function () {
    var tests = [
      { test: {}, expect: false },
      { test: '_', expect: false },
      { test: 1, expect: true },
      { test: '1a', expect: true },
      { test: 's', expect: true },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.test + ' should return ' + item.expect, function () {
        assert.strictEqual(Util.validatorAlNum(item.test), item.expect);
      });
    });
  });

  // 必须是中文字符
  describe('validatorChineseCharacter', function () {
    var tests = [
      { test: {}, expect: false },
      { test: '_', expect: false },
      { test: 1, expect: false },
      { test: '1a', expect: false },
      { test: 's', expect: false },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.test + ' should return ' + item.expect, function () {
        assert.strictEqual(
            Util.validatorChineseCharacter(item.test), item.expect);
      });
    });
  });

  // 请输入正确的11位手机号
  describe('validatorPhoneNumber', function () {
    var tests = [
      { test: {}, expect: false },
      { test: '_', expect: false },
      { test: 1, expect: false },
      { test: '1a', expect: false },
      { test: 's', expect: false },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.test + ' should return ' + item.expect, function () {
        assert.strictEqual(
            Util.validatorPhoneNumber(item.test), item.expect);
      });
    });
  });

  // 用户名不合法
  describe('validatorUserName', function () {
    var tests = [
      { test: {}, expect: false },
      { test: '_', expect: false },
      { test: 1, expect: false },
      { test: '1a', expect: true },
      { test: 's', expect: false },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.test + ' should return ' + item.expect, function () {
        assert.strictEqual(
            Util.validatorUserName(item.test), item.expect);
      });
    });
  });

  // 密码不合法
  describe('validatorPassword', function () {
    var tests = [
      { userName: '123456', password: {}, expect: false },
      { userName: '123456', password: '_', expect: false },
      { userName: '123456', password: 1, expect: false },
      { userName: '123456', password: '1a', expect: false },
      { userName: '123456', password: '123456', expect: false },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.password + ' should return ' +
        item.expect, function () {
          assert.strictEqual(
            Util.validatorPassword(item.password, item.userName), item.expect);
        }
      );
    });
  });
});
