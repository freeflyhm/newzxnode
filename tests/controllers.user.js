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
      var Model = require('../app/model');
      var UserModel  = Model.getModel(process.env.DB_HOST_TEST, 'user', 'auth');
      UserModel.findOne({}, function (err, user) {
        console.log('-----------------UserModel.findOne');
        console.log(user);
        User._comparePassword(user, obj, function (results) {
          assert.strictEqual(results.success, 97);
          done();
        });
      });
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
});
