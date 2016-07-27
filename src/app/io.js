/* jshint
   node:  true, devel:  true, maxstatements: 40, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true, maxdepth: 3
 */

/**
 * socket.io 模块
 * @module app/io
 */
'use strict';

var Ctrl  = require('./ctrl');

var dbNames = {
  '深圳': 'sz',
  '广州': 'gz',
  '杭州': 'hz',
};

var cookieUsers = {};

exports.listen = function (serv) {
  var io    = require('socket.io').listen(serv);
  var ioJwt = require('socketio-jwt');

  // One roundtrip
  io.use(ioJwt.authorize({
    secret: process.env.JWT_TOKEN_SECRET,
    handshake: true,
  }));

  io.on('connection', function (socket) {
    var decoded = socket.decoded_token;
    var dbName = dbNames[decoded.city];
    var uid = decoded.user._id;
    var checkSys99 = false;
    var checkSys30 = false;
    var checkSys20 = false;
    var checkSys10 = false;
    var checkCus30 = false;
    var checkCus20 = false;
    var checkCus10 = false;
    var cookieUser;
    var Setplace;

    // 初始化房间
    if (!cookieUsers[dbName]) {
      cookieUsers[dbName] = {};
    }

    // 检测是否已经登录
    // 同一个账号同一城市只能同时登陆一个
    if (cookieUsers[dbName][uid]) {
      // 通知自己有人已经使用此账号登陆了
      socket.emit('on-somebody-online');
    } else {
      // 正常通过
      cookieUser = {
        _id: uid,
        socketId: socket.id,
        category: decoded.company.category,
        role: decoded.user.role,
      };

      // add to cookieUsers
      cookieUsers[dbName][uid] = cookieUser;

      // 发送到客户端
      socket.emit('connect_decoded', decoded);

      // 统一计算权限
      if (cookieUser.role === 99) {
        checkSys99 = true;
      } else if (cookieUser.category === 30) {
        if (cookieUser.role === 30) {
          checkSys30 = true;
          checkSys20 = true;
          checkSys10 = true;
        } else if (cookieUser.role === 20) {
          checkSys20 = true;
          checkSys10 = true;
        } else if (cookieUser.role === 10) {
          checkSys10 = true;
        }
      } else {
        if (cookieUser.role === 30) {
          checkCus30 = true;
          checkCus20 = true;
          checkCus10 = true;
        } else if (cookieUser.role === 20) {
          checkCus20 = true;
          checkCus10 = true;
        } else if (cookieUser.role === 10) {
          checkCus10 = true;
        }
      }

      // 初始化 controllers
      Setplace = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'setplace');

      // echo 测试专用
      socket.on('emit-echo', function (msg, callback) {
        callback(msg);
      });

      socket.on('emit-getlist', function (obj, callback) {
        if (checkSys30) {
          Setplace.list(obj, function (results) {
            callback(results);
          });
        } else {
          callback([]);
        }
      });
    }

    // 刷新、关闭网页、退出浏览器
    socket.on('disconnect', function () {
      delete cookieUsers[dbName][uid];
    });
  });
};
