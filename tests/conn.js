/* jshint
   node:  true, devel:  true, maxstatements: 7,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it */

/* conn.js - Mocha conn test */
'use strict';

var assert = require('assert');

describe('src/app/conn.js', function () {
  var dbHost = process.env.DB_HOST_TEST;
  var getConn = require('../src/app/conn').getConn;
  var conn1 = getConn(dbHost, 'auth');
  var conn2 = getConn(dbHost, 'auth');

  it('conn1 === conn2', function () {
    assert.deepEqual(conn1, conn2);
  });
});
