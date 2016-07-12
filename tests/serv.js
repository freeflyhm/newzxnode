/*
 * index.js - Mocha serv test
*/

/* jshint      node:  true, devel:  true, maxstatements: 5,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, before, it, after */

'use strict';

var PORT = 3000;
var boot = require('../app/serv').boot;
var shutdown = require('../app/serv').shutdown;
var superagent = require('superagent');
var assert = require('assert');

var io = require('socket.io-client');

describe('server', function () {
  before(function () {
    boot(PORT);
  });

  describe('request', function () {
    it('port should equal 3000', function () {
      assert.strictEqual(PORT, 3000);
    });

    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + PORT)
        .end(function (err, res) { // jshint ignore:line
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

  describe('io', function () {
    var options = {
      transports: ['websocket'],
      'force new connection': true,
    };

    it('echos message', function (done) {
      var client = io.connect('http://localhost:' + PORT, options);
      client.once('connect', function () {
        client.emit('echo', 'Hello World', function (message) {
          assert.strictEqual(message, 'Hello World');

          client.disconnect();
          done();
        });
      });
    });

    it('emit-register', function (done) {
      var client = io.connect('http://localhost:' + PORT, options);
      client.once('connect', function () {
        client.emit(
            'emit-register',
            { userName: 'test', password: '123456' },
            function (results) {
              var id = results.user._id;
              assert.strictEqual(results.success, 1);

              client.emit(
                'emit-register',
                { userName: 'test', password: '123456' },
                function (results) {
                  assert.strictEqual(results.success, 13);

                  client.emit(
                    'emit-remove',
                    { id: id },
                    function (results) {
                      assert.strictEqual(results.success.ok, 1);

                      client.disconnect();
                      done();
                    }
                  );
                }
              );
            }
        );
      });
    });
  });

  after(function () {
    shutdown();
  });
});
