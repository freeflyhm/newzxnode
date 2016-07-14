/*
 * index.js - Mocha serv test
*/

/* jshint      node:  true, devel:  true, maxstatements: 7, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, before, it, after */

'use strict';

var PORT = 3000;
var site = 'http://localhost:' + PORT;
var boot = require('../app/serv').boot;
var shutdown = require('../app/serv').shutdown;
var superagent = require('superagent');
var assert = require('assert');

var io = require('socket.io-client');

describe('server test', function () {
  before(function () {
    boot(process.env.DB_HOST_TEST, PORT);
  });

  describe('GET /', function () {
    it('should respond to GET', function (done) {
      superagent.get(site)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'server look\'s good');
          done();
        });
    });
  });

  describe('POST /api/removeuser error', function () {
    it('dbHost=newzxmongo', function (done) {
      superagent.post(site + '/api/removeuser')
        .send({ dbHost: 'newzxmongo', token: 'token' })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body.success, 10);
          done();
        });
    });

    it('!id', function (done) {
      superagent.post(site + '/api/removeuser')
        .send({ dbHost: process.env.DB_HOST_TEST, token: 'token' })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body.success, 20);
          done();
        });
    });
  });

  describe('io', function () {
    var options = {
      transports: ['websocket'],
      'force new connection': true,
    };
    var token;

    before(function (done) {
      // get token
      superagent.post(site + '/api/register')
        .send({ userName: 'test', password: '123456' })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body.success, 1);

          superagent.post(site + '/api/register')
            .send({ userName: 'test', password: '123456' })
            .end(function (err, res) {
              assert.strictEqual(err, null);
              assert.strictEqual(res.body.success, 13);

              superagent.post(site + '/api/login')
                .send({ userName: 'test', password: '1234567' })
                .end(function (err, res) {
                  token = res.body.token;
                  assert.strictEqual(err, null);

                  superagent.post(site + '/api/login')
                    .send({ userName: 'test', password: '123456' })
                    .end(function (err, res) {
                      token = res.body.token;
                      assert.strictEqual(err, null);
                      done();
                    });
                });
            });
        });
    });

    it('emit-echo', function (done) {
      var client = io.connect('http://localhost:' + PORT, options);
      client.once('connect', function () {
        client.on('authenticated', function () {
          client.emit('emit-echo', 'hello', function (message) {
            assert.strictEqual(message, 'hello');
            client.disconnect();
            done();
          });
        });

        client.emit('authenticate', { token: token });
      });
    });

    it('emit-kbsms', function (done) {
      var client = io.connect('http://localhost:' + PORT, options);
      client.once('connect', function () {
        client.on('authenticated', function () {
          client.emit('emit-kbsms',
            { thisDate: '2016-07-13', city: 'sz' },
            function (results) {
              assert(results.length > 0);
              done();
            }
          );
        });
      });

      client.emit('authenticate', { token: token });
    });

    it('unauthorized', function (done) {
      var client = io.connect('http://localhost:' + PORT, options);
      client.once('connect', function () {
        client.on('unauthorized', function (err) {
          assert(err.data.type === 'UnauthorizedError' ||
              err.data.code === 'invalid_token');
          done();
        });

        client.emit('authenticate', { token: 'token' });
      });
    });

    after(function (done) {
      superagent.post(site + '/api/removeuser')
        .send({ dbHost: process.env.DB_HOST_TEST, token: token })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.body.success, 1);
          done();
        });
    });
  });

  after(function () {
    shutdown();
  });
});
