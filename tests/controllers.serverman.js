/* jshint
   node: true, devel: true, maxstatements: 30, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, after */

/* controllers/serverman.js - Mocha controllers/serverman test */
'use strict';

if (require('./testconf').controllersServerman) {
  describe('controllers/serverman.js', function () {
    var assert = require('assert');

    var dbHost = process.env.DB_HOST_TEST;

    var ServermanCtrl = require('../src/app/controllers/serverman');
    var Serverman = ServermanCtrl.createCtrl(dbHost, 'sz');

    var SchemaServerman = require('../src/app/schemas/serverman');
    var Conn = require('../src/app/conn').getConn(dbHost, 'sz');
    var ServermanModel = Conn.model('Serverman', SchemaServerman);

    var _test = function (test, func) {
      it('success === ' + test.success, function (done) {
        func(test.obj, function (results) {
          assert.strictEqual(results.success, test.success);
          done();
        });
      });
    };

    var _tests = function (tests, func) {
      tests.forEach(function (test) {
        _test(test, func);
      });
    };

    var sid;

    describe('list', function () {
      it('should ok', function (done) {
        Serverman.list({}, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });

      it('should ok', function (done) {
        Serverman.list({ _id: {} }, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });
    });

    describe('add', function () {
      var obj11000 = { company: {}, name: {} };
      var obj1 = { name: 'hemiao' };
      var tests = [
        { obj: obj11000, success: 11000 },
        { obj: obj1, success: 1 },
      ];

      _tests(tests, Serverman.add);
    });

    describe('update', function () {
      it('success === 11001', function (done) {
        Serverman.update(
          { _id: {}, name: 'dd' },
          function (results) {
            assert.strictEqual(results.success, 11001);
            done();
          }
        );
      });

      it('should ok', function (done) {
        ServermanModel.count({}, function (err, count) {
          var beforeCount = count;
          assert.strictEqual(err, null);
          ServermanModel.findOne({ name: 'hemiao' }, function (err, serverman) {
            var beforeTime = serverman.meta.updateAt.valueOf();
            sid  = serverman._id;

            assert.strictEqual(err, null);

            Serverman.update(
              { _id: serverman._id, name: 'heb' },
              function (results) {
                assert.strictEqual(results.success, 1);

                assert.strictEqual(results.serverman.name, 'heb');
                assert(beforeTime <
                    results.serverman.meta.updateAt.valueOf());

                ServermanModel.count({}, function (err, count) {
                  assert.strictEqual(err, null);
                  assert.strictEqual(beforeCount, count);
                  done();
                });
              }
            );
          });
        });
      });
    });

    describe('remove', function () {
      it('should ok', function (done) {
        Serverman.remove(sid, function (results) {
          assert(results.success, 1);
          done();
        });
      });

      it('success === 11002', function (done) {
        Serverman.remove({}, function (results) {
          assert(results.success, 11002);
          done();
        });
      });
    });

    after(function (done) {
      ServermanModel.remove({}, function () {
        ServermanModel.find({}, function (err, servermans) {
          assert.strictEqual(servermans.length, 0);
          done();
        });
      });
    });
  });
}
