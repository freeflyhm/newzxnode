/*
 * io.js - socket.io
*/

/* jshint      node:  true, devel:  true, maxstatements: 4, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

var listen = function (serv) {
  var io = require('socket.io').listen(serv);

  // the important parts of echo server
  io.sockets.on('connection', function (socket) {
    socket.on('echo', function (msg, callback) {
      callback = callback || function () {};

      socket.emit('echo', msg);

      callback(null, 'Done.');
    });
  });
};

exports.listen = listen;
