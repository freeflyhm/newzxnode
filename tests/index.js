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
var should = require('should');

describe('server', function () {
  before(function () {
    boot();
  });

  describe('homepage', function () {
    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          should(res.status).to.equal(200);
          done();
        });
    });
  });

  after(function () {
    shutdown();
  });
});
