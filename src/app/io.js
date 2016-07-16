/* jshint
   node:  true, devel:  true, maxstatements: 6, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true
 */

/**
 * socket.io 模块
 * @module app/io
 */
'use strict';

exports.listen = function (serv) {
  //var Ctrl  = require('./ctrl');
  var ioJwt = require('socketio-jwt');
  var io    = require('socket.io').listen(serv);

  // io.set('authorization', ioJwt.authorize({
  //   secret: process.env.JWT_TOKEN_SECRET,
  //   handshake: true,
  // }));

  // the important parts of echo server
  io.sockets.on('connection', ioJwt.authorize({
    secret: process.env.JWT_TOKEN_SECRET,
    timeout: 15000,
    callback: 15000,
  })).on('authenticated', function (socket) {
    //console.log(socket.decoded_token.userName, ' connected');

    //var host = process.env.DB_HOST;

    //var dbname = 'sz';

    // 初始化 Controllers
    //var User = Ctrl.getCtrl(host, 'auth', 'user');

    // echo 测试专用
    socket.on('emit-echo', function (msg, callback) {
      callback(msg);
    });

    socket.on('emit-kbsms', function (obj, callback) {
      //console.log(obj);

      callback([1, 2]);
    });
  });
};
