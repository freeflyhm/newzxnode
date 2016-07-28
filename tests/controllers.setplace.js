/* jshint
   node: true, devel: true, maxstatements: 30, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it */

/* controllers/setplace.js - Mocha controllers/setplace test */
'use strict';

if (require('./testconf').controllersSetplace) {
  describe('controllers/setplace.js', function () {
    var assert = require('assert');
    var SetplaceCtrl = require('../src/app/controllers/setplace');
    var Setplace = SetplaceCtrl.createCtrl(process.env.DB_HOST_TEST, 'sz');

    describe('list', function () {
      it('should ok', function (done) {
        Setplace.list({}, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });

      it('should ok', function (done) {
        Setplace.list({ _id: {} }, function (result) {
          assert.strictEqual(JSON.stringify(result), '[]');
          done();
        });
      });
    });
  });
}
