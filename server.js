/*
 * server.js - node 入口文件
*/

/* jshint      node:  true, devel:  true,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

/* 引入模块依赖 */
var http = require('http');
var app = require('./app/app');

/* 定义服务 */
var server = http.createServer(app);

/* 定义对外暴露的公共方法 */
var boot = function () {
  /* 在多核系统上启动 cluster 多核处理模块(可选，待实现) */
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'));
  });
};

var shutdown = function () {
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
