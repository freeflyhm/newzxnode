/*
 * serv.js - socket.io
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

/* 引入模块依赖 */
var http = require('http');
var app = require('./app');

/* 定义服务 */
var serv = http.createServer(app);

var io = require('socket.io').listen(serv);

// the important parts of echo server
io.sockets.on("connection", function (socket) {
    socket.on("echo", function (msg, callback) {
        callback = callback || function () {};
 
        socket.emit("echo", msg);
 
        callback(null, "Done.");
    });
});

/* 定义对外暴露的公共方法 */
var boot = function () {
  /* 在多核系统上启动 cluster 多核处理模块(可选，待实现) */
  serv.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'));
  });
};

var shutdown = function () {
  serv.close();
};

exports.boot = boot;
exports.shutdown = shutdown;
exports.port = app.get('port');