/*
 * conn.js - Mocha conn test
*/

/* jshint      node:  true, devel:  true, maxstatements: 5,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('Conn.getConn', function () {
  var getConn = require('../app/conn').getConn;
  var conn = getConn('test');

  it('should be an function', function () {
    assert(typeof getConn === 'function');
  });

  it('getConn(db) should be an object', function () {
    assert(typeof conn === 'object');
  });

  it('conn === conn2', function () {
    var conn2 = getConn('test');
    assert.deepEqual(conn, conn2);
  });
});
