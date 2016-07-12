/*
 * model.js - Mocha model test
*/

/* jshint      node:  true, devel:  true, maxstatements: 5,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('Model.getModel', function () {
  var host = process.env.DB_HOST_TEST;
  var getModel = require('../app/model').getModel;
  var User = getModel(host, 'user', 'test');

  it('User should as an function', function () {
    assert(typeof User === 'function');
  });

  it('User should same as User2', function () {
    var User2 = getModel(host, 'user', 'test');
    assert.deepEqual(User, User2);
  });
});
