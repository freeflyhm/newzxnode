/* jshint
   node: true, devel: true, maxstatements: 14, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, after */

/* schemas/serverman.js - Mocha schemas/serverman test */
'use strict';

if (require('./testconf').schemasServerman) {
  describe('schemas/serverman.js', function () {
    var assert = require('assert');
    var SchemaServerman = require('../src/app/schemas/serverman');

    var dbHost = process.env.DB_HOST_TEST;
    var Conn = require('../src/app/conn').getConn(dbHost, 'sz');
    var Serverman = Conn.model('Serverman', SchemaServerman);

    var servermanObj = {
      name: 'testServerman',
      t1: {},
    };
    var fid;

    describe('pre save', function () {
      it('isNew createAt === updateAt', function (done) {
        var newServerman = new Serverman(servermanObj);
        newServerman.save(function (err, serverman) {
          assert.strictEqual(err, null);
          assert.strictEqual(serverman.meta.createAt.valueOf(),
              serverman.meta.updateAt.valueOf());
          fid = serverman._id;
          done();
        });
      });

      it('!isNew createAt < updateAt', function (done) {
        Serverman.findOne({ _id: fid }, function (err, serverman) {
          assert.strictEqual(err, null);
          serverman.save(function (err, serverman) {
            assert.strictEqual(err, null);
            assert(serverman.meta.createAt.valueOf() <
                serverman.meta.updateAt.valueOf());
            done();
          });
        });
      });
    });

    // describe('pre update', function () {
    //   it('update updateAt', function (done) {
    //     setTimeout(function () {
    //       Serverman.findOneAndUpdate(
    //         { _id: fid },
    //         { $set: { name: 'hje' } },
    //         function (err, isOk) {
    //           assert.strictEqual(err, null);
    //           console.log(isOk);
    //           //assert.strictEqual(isOk.ok, 1);

    //           Serverman.findOne({ _id: fid }, function (err, serverman) {
    //             assert.strictEqual(err, null);
    //             console.log(serverman.meta.updateAt.valueOf());
    //             console.log(serverman.name);
    //             done();
    //           });
    //         }
    //       );
    //     }, 1000);
    //   });
    // });

    after(function (done) {
      Serverman.remove({}, function () {
        Serverman.find({}, function (err, servermans) {
          assert.strictEqual(servermans.length, 0);
          done();
        });
      });
    });
  });
}
