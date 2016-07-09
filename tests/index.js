/*
 * index.js - Mocha test
*/

/* jshint      node:  true, devel:  true, maxstatements: 4,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, before, it, after */

'use strict';

var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent');
var assert = require('assert');

describe('server', function () {
  before(function () {
    boot();
  });

  describe('homepage', function () {
    it('port should equal 3000', function () {
      assert(port, 3000);
    });

    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (err, res) {
          assert(res.status, 200);
          done();
        });
    });
  });

  after(function () {
    shutdown();
  });
});
