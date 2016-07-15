/*
 * util.js - Mocha util test
*/

/* jshint      node:  true, devel:  true, maxstatements: 7,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('src/app/util.js', function () {
  var Util = require('../src/app/util');

  // 首字母大写
  describe('replaceFirstUpper', function () {
    it('should be an function', function () {
      assert(typeof Util.replaceFirstUpper === 'function');
    });

    it('should as Should', function () {
      assert.strictEqual(Util.replaceFirstUpper('should'), 'Should');
    });
  });

  // 字母或数字组合
  describe('validator_alNum', function () {
    var tests = [
      { test: {}, expect: false },
      { test: '_', expect: false },
      { test: 1, expect: true },
      { test: '1a', expect: true },
      { test: 's', expect: true },
    ];

    tests.forEach(function (item) {
      it('test: ' + item.test + ' should return ' + item.expect, function () {
        assert.strictEqual(Util.validator_alNum(item.test), item.expect);
      });
    });
  });

  // 必须是中文字符
  describe('validator_chineseCharacter', function () {
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
            Util.validator_chineseCharacter(item.test), item.expect);
      });
    });
  });

  // 请输入正确的11位手机号
  describe('validator_phoneNumber', function () {
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
            Util.validator_phoneNumber(item.test), item.expect);
      });
    });
  });

  // 用户名不合法
  describe('validator_userName', function () {
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
            Util.validator_userName(item.test), item.expect);
      });
    });
  });

  // 密码不合法
  describe('validator_password', function () {
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
            Util.validator_password(item.password, item.userName), item.expect);
        }
      );
    });
  });
});
