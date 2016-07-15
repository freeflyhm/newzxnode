/*
 * app.js - Express app
*/

/* jshint            node:  true,  devel:  true,
   maxstatements: 16, maxparams: 4, maxdepth: 2,
   maxerr: 50,       nomen: true,  regexp: true */

'use strict';

exports.createApp = function (dbHost) {
  /* 引入模块依赖 */
  var express    = require('express');

  //var path       = require('path');
  var bodyParser = require('body-parser');
  var jwt        = require('jsonwebtoken');
  var Ctrl       = require('./ctrl');
  var User       = Ctrl.getCtrl(dbHost, 'user', 'auth');

  /* 实例化 Express.js 对象 */
  var app = express();

  /* 相关配置 */

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
      res.json(results);
    });
  });

  app.post('/api/login', function (req, res) {
    // TODO: validate the actual user user
    User.login(req.body, function (results) {
      if (results.success === 1) {
        var user = results.user;

        var profile = {
          _id: user._id,
          company: user.company,
          userName: user.userName,
        };

        // we are sending the profile in the token
        var token = jwt.sign(
          profile,
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: 60 * 60 * 24 }
        );

        res.json({ success: 1, token: token });
      } else {
        res.json({ success: 2 });
      }
    });
  });

  app.post('/api/removeuser', function (req, res) {
    var dbHost = req.body.dbHost;
    var decoded;
    var cid;
    var uid;

    if (dbHost === 'newzxmongo') {
      res.json({ success: 10 });
      return;
    }

    decoded = jwt.decode(req.body.token, process.env.JWT_TOKEN_SECRET);
    cid = decoded && decoded.company;
    uid = decoded && decoded._id;

    if (cid && uid) {
      User._remove(cid, uid, function (results) {
        res.json(results);
      });

      return;
    }

    res.json({ success: 20 });
  });

  return app;
};
