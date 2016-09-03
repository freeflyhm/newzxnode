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

  var bodyParser = require('body-parser');
  var jwt        = require('jsonwebtoken');

  var request    = require('request');

  var getCtrl    = require('./ctrl');
  var User       = getCtrl(dbHost, 'auth', 'user');

  /* 实例化 Express.js 对象 */
  var app = express();

  /* 相关配置 */
  /* 连接数据库 */
  /* 定义中间件 */
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));

  /* 定义路由 */
  app.get('/', function (req, res) {  // jshint ignore: line
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('server look\'s good');
  });

  /**
   * api: 注册
   *
   * req.body {
   *   province
   *   city
   *   cname
   *   ctel
   *   cfax
   *   caddress
   *   uusername
   *   upassword
   *   uname
   *   uphone
   *   uqq
   *   ucompanyabbr
   * }
   * @returns {}
   */
  app.post('/api/register', function (req, res) {
    // 限制客户端输入数据
    var obj = {
      companyObj: {
        province: req.body.province,
        city: req.body.city,
        name: req.body.cname,
        tel: req.body.ctel,
        fax: req.body.cfax,
        address: req.body.caddress,
      },
      userObj: {
        userName: req.body.uusername,
        password: req.body.upassword,
        name: req.body.uname,
        phone: Number(req.body.uphone),
        qq: Number(req.body.uqq),
        companyAbbr: req.body.ucompanyabbr,
      },
    };

    User.register(obj, function (results) {
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

  app.get('/api/provincecity', function (req, res) {
    var results = require('./zxutil').PROVINCE_CITY;
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(results);
  });

  app.get('/api/code/:id', function (req, res) {
    var id = req.params.id || '1';
    var j = request.jar();
    var url;

    if (id === '1') {
      url = 'http://pingan.com/sics/sicsweb/image.jsp';
    } else {
      url = 'http://www.e-chinalife.com/' +
          'selfcard/selfcard/validateNum/image.jsp';
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    request.get(url, { jar: j })
    .on('error', function (err) {
      console.log(err);
    }).pipe(res);
  });

  return app;
};

module.exports = createApp;
