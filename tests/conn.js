/*
 * conn.js - Mocha conn test
*/

/* jshint      node:  true, devel:  true, maxstatements: 7,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('Conn.getConn', function () {
  var dbHost = process.env.DB_HOST_TEST;
  var getConn = require('../app/conn').getConn;
  var conn = getConn(dbHost, 'test');

  it('should be an function', function () {
    assert(typeof getConn === 'function');
  });

  it('getConn(dbHost, db) should be an object', function () {
    assert(typeof conn === 'object');
  });

  it('conn === conn2', function () {
    var conn2 = getConn(dbHost, 'test');
    assert.deepEqual(conn, conn2);
  });
});
