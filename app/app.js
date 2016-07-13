/*
 * app.js - Express app
*/

/* jshint            node:  true,  devel:  true,
   maxstatements: 13, maxparams: 2, maxdepth: 2,
   maxerr: 50,       nomen: true,  regexp: true */

'use strict';

exports.createApp = function (dbHost) {
  /* 引入模块依赖 */
  var express    = require('express');
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
      console.log(process.env.JWT_TOKEN_SECRET);
      var user = results.user;

      var profile = {
        _id: user._id,
        userName: user.userName,
      };

      // we are sending the profile in the token
      var token = jwt.sign(
        profile,
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );

      res.json({ token: token });
    });
  });

  app.post('/api/removeuser', function (req, res) {
    var decoded;
    var id;

    if (dbHost === 'newzxmongo') {
      res.json({ success: 2 });
    } else {
      decoded = jwt.decode(req.body.token, process.env.JWT_TOKEN_SECRET);
      id = decoded && decoded._id;

      if (id) {
        User.remove(id, function (results) {
          res.json(results);
        });
      } else {
        res.json({ success: 2 });
      }
    }
  });

  return app;
};
