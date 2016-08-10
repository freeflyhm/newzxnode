/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * idcardsm controller 模块
 * @module app/controllers/idcardsm
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var Model = require('../model');
  var Idcardsm = Model.getModel(dbHost, dbName, 'idcardsm');

  var fs = require('fs');
  var errorLogfile =
      fs.createWriteStream(__dirname + 'db_err.log', { flags: 'a' });

  // public methods
  var add;

  add = function (obj) {
    var newObj = new Idcardsm(obj);

    newObj.save(function (err) {
      var meta;

      if (err) {
        meta = '[' + Date.now() + '] write db error 16999:\n';
        errorLogfile.write(meta +
            JSON.stringfy(err) +
            '\n' + JSON.stringify(obj) + '\n\n');
      }
    });
  };

  return {
    add: add,
  };
};

module.exports = createCtrl;
