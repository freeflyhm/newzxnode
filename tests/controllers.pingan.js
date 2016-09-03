/* jshint
   node: true, devel: true, maxstatements: 30, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, after */

/**
 * controllers/pingan.js - Mocha controllers/pingan test
 */
'use strict';

if (require('./testconf').controllersPingan) {
  describe('controllers/pingan.js', function () {
    var assert = require('assert');
    var createCtrl = require('../src/app/controllers/pingan');
    console.log(createCtrl);
    var Pingan = createCtrl();

    describe('Step12downloadImg', function () {
      it('should ok', function (done) {
        assert.strictEqual(typeof Pingan.Step12downloadImg, 'function');
        Pingan.Step12downloadImg(function (result) {
          console.log(result);

          done();
        });
      });
    });
  });
}
