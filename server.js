/*
 * server.js - node 入口文件
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

var serv = require('./app/serv');

serv.boot();