/*
 * server.js - Express server with routing
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

/* 引入模块依赖 */
var express = require('express');
var http = require('http');

/* 实例化 Express.js 对象 */
var app = express();

/* 所有var前置 */
var server;
var boot;
var shutdown;

/* 相关配置 */
app.set('port', process.env.PORT || 3000);

/* 连接数据库 */
/* 定义中间件 */

/* 定义路由 */
app.get('/', function (req, res) {  // jshint ignore:line
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('服务器运行正常\n');
});

/* 定义服务 */
server = http.createServer(app);

/* 定义对外暴露的公共方法 */
boot = function () {
  /* 在多核系统上启动 cluster 多核处理模块(可选，待实现) */
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'));
  });
};

shutdown = function () {
  server.close();
};

// 判断server.js是直接从node执行还是通过模块引用
// 当一个文件是直接从node执行的,那么require.main变量会设置成module对象,
// 这意味着你可以在测试时判断一个模块是否是直接运行的
if (require.main === module) {
  /* 启动服务 */
  boot();
} else {
  /* 以模块形式输出，便于测试 */
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
