/*
 * ctrl.js - mongoose controller
*/

/* jshint             node:  true,  devel:  true,
   maxstatements: 14, maxparams: 2, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true */

'use strict';

/* 数据结构
  ctrls = {
    user: {
      hz: Controller,
      ...
    },
    ...
  }
*/

var ctrls = {};

exports.getCtrl = function (ctrlName, dbName) {
  var ctrl;
  var ctrlObj;

  if (ctrls[ctrlName]) {
    if (ctrls[ctrlName][dbName]) {

      return ctrls[ctrlName][dbName];
    } else {
      ctrlObj = require('./controllers/' + ctrlName);
      ctrl = ctrlObj.createCtrl(dbName);
      ctrls[ctrlName][dbName] = ctrl;

      return ctrl;
    }
  } else {
    ctrlObj = require('./controllers/' + ctrlName);
    ctrl = ctrlObj.createCtrl(dbName);
    ctrls[ctrlName] = {};
    ctrls[ctrlName][dbName] = ctrl;

    return ctrl;
  }
};
