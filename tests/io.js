/* jshint
   node: true, devel: true, maxstatements: 7,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it */

/* io.js - Mocha io test */
'use strict';

if (require('./testconf').io) {
  describe('io.js', function () {
    var assert = require('assert');

    var dbHost  = process.env.DB_HOST_TEST;
    var http = require('http');
    var app = require('../src/app/app').createApp(dbHost);
    var serv = http.createServer(app);

    require('../src/app/io').listen(serv);

    it('true', function () {
      assert.strictEqual(1, 1);
    });
  });
}
