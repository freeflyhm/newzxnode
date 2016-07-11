/*
 * util.js - Mocha util test
*/

/* jshint      node:  true, devel:  true, maxstatements: 4,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it */

'use strict';

var assert = require('assert');

describe('Util', function () {
  var Util = require('../app/util');

  describe('replaceFirstUpper', function () {
    it('should be an function', function () {
      assert(typeof Util.replaceFirstUpper === 'function');
    });

    it('should as Should', function () {
      assert.strictEqual(Util.replaceFirstUpper('should'), 'Should');
    });
  });
});
