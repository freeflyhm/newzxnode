/*
 * io.js - socket.io
*/

/* jshint      node:  true, devel:  true, maxstatements: 5, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

exports.listen = function (serv) {
  var Ctrl = require('./ctrl');

  var io   = require('socket.io').listen(serv);

  // the important parts of echo server
  io.sockets.on('connection', function (socket) {
    var dbname = 'sz';

    // 初始化 Controllers
    var User = Ctrl.getCtrl('user', dbname);

    socket.on('echo', function (msg, callback) {
      callback(msg);
    });

    // 注册
    socket.on('emit-register', function (obj, callback) {
      User.register(obj, function (results) {
        callback(results);
      });
    });

    // 删除
    socket.on('emit-remove', function (obj, callback) {
      User.remove(obj.id, function (results) {
        callback(results);
      });
    });
  });
};
