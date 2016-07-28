/* jshint
   node: true, devel: true, maxstatements: 30, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, after */

/* controllers/dengjipai.js - Mocha controllers/dengjipai test */
'use strict';

if (require('./testconf').controllersDengjipai) {
  var file = 'dengjipai';
  describe('controllers/' + file + '.js', function () {
    var assert = require('assert');

    var dbHost = process.env.DB_HOST_TEST;

    var TestCtrl = require('../src/app/controllers/' + file);
    var TestCr = TestCtrl.createCtrl(dbHost, 'sz');

    var TestSchema = require('../src/app/schemas/' + file);
    var Conn = require('../src/app/conn').getConn(dbHost, 'sz');
    var util = require('../src/app/util');
    var TestModel =
        Conn.model(util.validatorReplaceFirstUpper(file), TestSchema);

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

    describe('_newSave', function () {
      var test = { obj: { name: {} }, success: 12999 };

      _test(test, TestCr._newSave);
    });

    describe('list', function () {
      it('should ok', function (done) {
        TestCr.list({}, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });

      it('should ok', function (done) {
        TestCr.list({ _id: {} }, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });
    });

    describe('add', function () {
      var obj12997 = { name: {} };
      var obj1 = { name: 'hemiao' };
      var tests = [
        { obj: obj12997, success: 12997 },
        { obj: obj1, success: 1 },
        { obj: obj1, success: 12004 },
      ];

      _tests(tests, TestCr.add);
    });

    describe('update', function () {
      it('success === 12996', function (done) {
        TestCr.update(
          { _id: {}, name: 'dd' },
          function (results) {
            assert.strictEqual(results.success, 12996);
            done();
          }
        );
      });

      it('should ok', function (done) {
        TestModel.count({}, function (err, count) {
          var beforeCount = count;
          assert.strictEqual(err, null);
          TestModel.findOne({ name: 'hemiao' }, function (err, res) {
            var beforeTime = res.meta.updateAt.valueOf();
            sid  = res._id;

            assert.strictEqual(err, null);

            TestCr.update(
              { _id: res._id, name: 'heb' },
              function (results) {
                assert.strictEqual(results.success, 1);

                assert.strictEqual(results.res.name, 'heb');
                assert(beforeTime <
                    results.res.meta.updateAt.valueOf());

                TestModel.count({}, function (err, count) {
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
        TestCr.remove(sid, function (results) {
          assert(results.success, 1);
          done();
        });
      });

      it('success === 12995', function (done) {
        TestCr.remove({}, function (results) {
          assert(results.success, 12995);
          done();
        });
      });
    });

    after(function (done) {
      TestModel.remove({}, function () {
        TestModel.find({}, function (err, results) {
          assert.strictEqual(results.length, 0);
          done();
        });
      });
    });
  });
}
