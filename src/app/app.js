/* jshint
   node:  true,  devel:  true,
   maxstatements: 16, maxparams: 4, maxdepth: 2,
   maxerr: 50,       nomen: true,  regexp: true
 */

/**
 * Express app 模块
 * @module app/app
 */
'use strict';

var createApp = function (dbHost) {
  /* 引入模块依赖 */
  var express    = require('express');

  //var path       = require('path');
  var bodyParser = require('body-parser');
  var jwt        = require('jsonwebtoken');
  var getCtrl    = require('./ctrl');
  var User       = getCtrl(dbHost, 'auth', 'user');

  /* 实例化 Express.js 对象 */
  var app = express();

  /* 相关配置 */

  // var DB_NAMES = {
  //   '深圳': 'sz',
  //   '广州': 'gz',
  //   '杭州': 'hz',
  // };

  //app.set('port', process.env.PORT || 3000);
  //app.set('dbHost', dbHost);

  /* 连接数据库 */
  /* 定义中间件 */
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));

  //app.use(express.static(path.join(__dirname, 'coverage')));

  /* 定义路由 */
  app.get('/', function (req, res) {  // jshint ignore: line
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('server look\'s good');
  });

  app.post('/api/register', function (req, res) {
    User.register(req.body, function (results) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(results);
    });
  });

  app.post('/api/login', function (req, res) {
    // 限制客户端输入数据
    var obj = {
      userName:  req.body.userName,
      password: req.body.password,
    };

    res.setHeader('Access-Control-Allow-Origin', '*');

    User.login(obj, function (results) {
      if (results.success === 1) {
        // var user = results.user;

        // var profile = {
        //   company: {
        //     _id: user.company._id,
        //     category: user.company.category,
        //   },
        //   user: {
        //     _id: user._id,
        //     role: user.role,
        //   },
        // };

        // we are sending the profile in the token
        // 有效时间 7days 60 * 60 * 24 * 7 = 604800
        var token = jwt.sign(
          results.profile,
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: 604800 }
        );

        return res.json({
          success: 1,
          token: token,
          dbName: results.dbName,
        });
      }

      res.json(results);
    });
  });

  // app.post('/api/removeuser', function (req, res) {
  //   var dbHost = req.body.dbHost;
  //   var decoded;
  //   var cid;
  //   var uid;

  //   if (dbHost === 'newzxmongo') {
  //     return res.json({ success: 10 });
  //   }

  //   decoded = jwt.decode(req.body.token, process.env.JWT_TOKEN_SECRET);
  //   cid = decoded && decoded.company;
  //   uid = decoded && decoded._id;

  //   if (cid && uid) {
  //     User._remove(cid, uid, function (results) {
  //       res.json(results);
  //     });

  //     return;
  //   }

  //   res.json({ success: 20 });
  // });

  return app;
};

module.exports = createApp;
