/*
 * app.js - Express app
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

/* 引入模块依赖 */
var express = require('express');

//var http = require('http');

/* 实例化 Express.js 对象 */
var app = express();

/* 相关配置 */

//app.set('port', process.env.PORT || 3000);

/* 连接数据库 */
/* 定义中间件 */

/* 定义路由 */
app.get('/', function (req, res) {  // jshint ignore:line
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('服务器运行正常\n');
});

module.exports = app;
