/*
 * index.js - Mocha test
*/

/* jshint      node:  true, devel:  true, maxstatements: 4,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, before, it, after */

'use strict';

var boot = require('../app/serv').boot;
var shutdown = require('../app/serv').shutdown;
var port = require('../app/serv').port;
var superagent = require('superagent');
var assert = require('assert');

var io = require('socket.io-client');

describe('server', function () {
  before(function () {
    boot();
  });

  describe('request', function () {
    it('port should equal 8080', function () {
      assert(port, 8080);
    });

    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (err, res) { // jshint ignore:line
          assert(res.status, 200);
          done();
        });
    });
  });

  after(function () {
    shutdown();
  });
});

describe("echo", function () {
  var server;
  var options = {
    transports: ['websocket'],
    'force new connection': true
  };

  beforeEach(function (done) {
    // start the server
    boot();

    done();
  });

  it("echos message", function (done) {
      var client = io.connect("http://localhost:8080", options);

      client.once("connect", function () {
          client.once("echo", function (message) {
              assert(message, "Hello World");
              
              client.disconnect();
              done();
          });

          client.emit("echo", "Hello World");
      });
  });

  after(function () {
    shutdown();
  });
});
