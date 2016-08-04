/* jshint
   node: true, devel: true, maxstatements: 7,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it */

/* app.js - Mocha app test */
'use strict';

if (require('./testconf').app) {
  describe('app.js', function () {
    var assert = require('assert');

    var dbHost  = process.env.DB_HOST_TEST;
    var app = require('../src/app/app').createApp(dbHost);

    it('app should be a function', function () {
      assert.strictEqual(typeof app, 'function');
    });
  });
}
