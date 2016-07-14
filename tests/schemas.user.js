/*
 * schemas/user.js - Mocha schemas/user test
*/

/* jshint      node:  true, devel:  true, maxstatements: 7, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('schemas/user', function () {
  //var UserSchema = require('../app/schemas/user');

  var bcrypt = require('bcrypt-nodejs');
  var Model = require('../app/model');
  var User  = Model.getModel(process.env.DB_HOST_TEST, 'user', 'auth');

  it('should be a function', function (done) {
    assert(typeof User._bcryptGenSalt === 'function');

    User._bcryptGenSalt(bcrypt, {}, { password: null }, function (results) {
      assert.strictEqual(results, 'Missing salt rounds');
      done();
    });
  });
});
