/* jshint
   node:  true, devel:  true, maxstatements: 60, maxparams: 3,
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
    var Feestemp;
    var Dengjipai;
    var Serverman;

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
        companyId: decoded.company._id,
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
      Feestemp = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'feestemp');
      Dengjipai = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'dengjipai');
      Serverman = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'serverman');

      // echo 测试专用
      socket.on('emit-echo', function (msg, callback) {
        callback(msg);
      });

      // 集合地点 30
      socket.on('emit-setplacelist', function (obj, callback) {
        if (checkSys30) {
          Setplace.list({}, function (results) {
            callback(results);
          });
        } else {
          callback([]);
        }
      });

      // 服务费模板 30
      socket.on('emit-feestemplist', function (obj, callback) {
        if (checkSys30) {
          Feestemp.list({}, function (results) {
            callback(results);
          });
        } else {
          callback([]);
        }
      });

      socket.on('emit-feestempupdate', function (obj, callback) {
        if (checkSys30) {
          Feestemp.update(
            obj,
            function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 19998, errMsg: '权限不够' });
        }
      });

      // 登机牌用户 30
      socket.on('emit-dengjipailist', function (obj, callback) {
        if (checkSys30) {
          Dengjipai.list({}, function (results) {
            callback(results);
          });
        } else {
          callback([]);
        }
      });

      socket.on('emit-dengjipaiadd', function (obj, callback) {
        if (checkSys30) {
          Dengjipai.add(
            { name: obj.name, password: obj.password },
            function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 12999, errMsg: '权限不够' });
        }
      });

      socket.on('emit-dengjipaiupdate', function (obj, callback) {
        if (checkSys30) {
          Dengjipai.update(
            { _id: obj.id, name: obj.name, password: obj.password },
            function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 12998, errMsg: '权限不够' });
        }
      });

      socket.on('emit-dengjipairemove', function (obj, callback) {
        if (checkSys30) {
          Dengjipai.remove(obj.id, function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 12997, errMsg: '权限不够' });
        }
      });

      // 现场责任人 20
      socket.on('emit-servermanlist', function (obj, callback) {
        if (checkSys20) {
          Serverman.list({ company: cookieUser.companyId }, function (results) {
            callback(results);
          });
        } else {
          callback([]);
        }
      });

      socket.on('emit-servermanadd', function (obj, callback) {
        if (checkSys20) {
          Serverman.add(
            { company: cookieUser.companyId, name: obj.name },
            function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 11999, errMsg: '权限不够' });
        }
      });

      socket.on('emit-servermanupdate', function (obj, callback) {
        if (checkSys20) {
          Serverman.update(
            { _id: obj.id, company: cookieUser.companyId, name: obj.name },
            function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 11998, errMsg: '权限不够' });
        }
      });

      socket.on('emit-servermanremove', function (obj, callback) {
        if (checkSys20) {
          Serverman.remove(obj.id, function (results) {
              callback(results);
            }
          );
        } else {
          callback({ success: 11997, errMsg: '权限不够' });
        }
      });
    }

    // 断开连接
    socket.on('disconnect', function () {
      delete cookieUsers[dbName][uid];
    });
  });
};
