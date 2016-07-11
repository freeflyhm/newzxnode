/*
 * conn.js - Mocha conn test
*/

/* jshint      node:  true, devel:  true, maxstatements: 4,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('Conn.getConn', function () {
  var getConn = require('../app/conn').getConn;

  it('should be an function', function () {
    assert(typeof getConn === 'function');
  });

  it('getConn() should be an object', function () {
    assert(typeof getConn() === 'object');
  });
});
