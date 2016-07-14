/*
 * controllers/user.js - Mocha controllers/user test
*/

/* jshint      node:  true, devel:  true, maxstatements: 5, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('controllers/user', function () {
  var UserCtrl = require('../app/controllers/user');
  var User = UserCtrl.createCtrl(process.env.DB_HOST_TEST, 'auth');

  describe('_newUserSave', function () {
    var userObj = { userName: {}, password: '123456' };

    it('should err 99', function (done) {
      User._newUserSave(userObj, function (results) {
        assert.strictEqual(results.success, 99);
        done();
      });
    });
  });

  describe('_comparePassword', function () {
    var obj = { password: {} };

    it('should err 97', function (done) {
      User._newUserSave({ userName: 'test97', password: '123456' },
        function (results) {
          var resultsUser = results.user;
          User._comparePassword(resultsUser, obj, function (results) {
            assert.strictEqual(results.success, 97);

            User._remove(resultsUser._id, function () {
              done();
            });
          });
        }
      );
    });
  });

  describe('register', function () {
    var userObj = { userName: {}, password: '123456' };

    it('should err 98', function (done) {
      User.register(userObj, function (results) {
        assert.strictEqual(results.success, 98);
        done();
      });
    });
  });

  describe('login', function () {
    var userObj = { userName: {} };

    it('should err 96', function (done) {
      User.login(userObj, function (results) {
        assert.strictEqual(results.success, 96);
        done();
      });
    });
  });

  describe('_remove', function () {
    var id = {};

    it('should err 95', function (done) {
      User._remove(id, function (results) {
        assert.strictEqual(results.success, 95);
        done();
      });
    });
  });
});
