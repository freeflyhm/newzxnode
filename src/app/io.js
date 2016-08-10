/* jshint
   node:  true, devel:  true, maxstatements: 60, maxparams: 4,
   maxerr: 50, nomen: true, regexp: true, maxdepth: 3
 */

/**
 * socket.io 模块
 * @module app/io
 */
'use strict';

// var Ctrl  = require('./ctrl');

// { 'sz': { '$uid': {'$sid' : true} } }
// 记录想要登录的客户端
var wantOnlineObj = {};

// private methods
var _getWantOnlineObj;
var _setWantOnlineObj;
var _delWantOnlineObj;
var _somebodyIsOnlined;

var _joinRoom;
var _leaveRoom;

_getWantOnlineObj = function (dbName, uid) {
  return wantOnlineObj[dbName][uid];
};

_setWantOnlineObj = function (dbName, uid, sid) {
  if (!wantOnlineObj[dbName]) {
    wantOnlineObj[dbName] = {};
    wantOnlineObj[dbName][uid] = {};
  } else if (!wantOnlineObj[dbName][uid]) {
    wantOnlineObj[dbName][uid] = {};
  }

  wantOnlineObj[dbName][uid][sid] = true;
};

_delWantOnlineObj = function (dbName, uid) {
  delete wantOnlineObj[dbName][uid];
};

_somebodyIsOnlined = function (nspzx, socket, dbName) {
  var canJoin = true;
  var roomObj = nspzx.adapter.rooms[dbName];
  var socketIdArr;

  if (roomObj) {
    socketIdArr = Object.keys(roomObj.sockets);

    socketIdArr.forEach(function (socketId) {
      var socketAnother = nspzx.connected[socketId];

      if (socketAnother.decoded_token.uid ===
          socket.decoded_token.uid) {
        if (canJoin) {
          // 服务器通知自己有人已经使用此账号进入房间了
          // 是否要踢人, 由用户决定
          socket.emit('semit-somebodyIsOnlined');
          canJoin = false;
        } else {
          // 其他人直接踢出房间
          _leaveRoom(socketAnother, dbName);
        }
      }
    });
  }

  if (canJoin) {
    _joinRoom(nspzx, socket, dbName);
  }
};

_joinRoom = function (nspzx, socket, dbName) {
  var roomObj = nspzx.adapter.rooms[dbName];
  var socketIdArr;

  if (roomObj) {
    socketIdArr = Object.keys(roomObj.sockets);

    socketIdArr.forEach(function (socketId) {
      var socketAnother = nspzx.connected[socketId];

      // 清场！！！
      if (socketAnother.decoded_token.uid ===
          socket.decoded_token.uid) {
        // 直接踢出房间
        _leaveRoom(socketAnother, dbName);
      }
    });
  }

  socket.join(dbName);
};

_leaveRoom = function (socket, dbName) {
  socket.leave(dbName);
};

var listen = function (serv) {
  var io = require('socket.io').listen(serv);
  var ioJwt = require('socketio-jwt');

  var nspzx = io.of('/nspzx');

  var getCtrl = require('./ctrl');
  var User = getCtrl(process.env.DB_HOST, 'auth', 'user');

  // One roundtrip
  nspzx.use(ioJwt.authorize({
    secret: process.env.JWT_TOKEN_SECRET,
    handshake: true,
  }));

  nspzx.on('connection', function (socket) {
    var dbName;

    // var user;

    // private methods
    // var _somebodyIsOnlined;
    var _somebodyWantOnline;
    var _cancelSomebodyOnline;

    // var _joinRoom;
    // var _leaveRoom;

    _somebodyWantOnline = function (nspzx, socket, _dbName) {
      var canJoin = true;
      var roomObj = nspzx.adapter.rooms[_dbName];
      var socketIdArr;

      if (roomObj) {
        socketIdArr = Object.keys(roomObj.sockets);

        socketIdArr.forEach(function (socketId) {
          var socketAnother = nspzx.connected[socketId];

          if (socketAnother.decoded_token.uid ===
              socket.decoded_token.uid) {
            if (canJoin) {
              // 服务器通知此账号自己想要登录
              // 是否拒绝, 由用户决定
              _setWantOnlineObj(_dbName, socket.decoded_token.uid, socket.id);
              socket.broadcast.to(socketId)
                .emit('semit-somebodyWantOnline');
              canJoin = false;
            } else {
              // 其他人直接踢出房间
              _leaveRoom(socketAnother, _dbName);
            }
          }
        });
      }

      if (canJoin) {
        _joinRoom(nspzx, socket, _dbName);
      }
    };

    _cancelSomebodyOnline = function (nspzx, socket, _dbName, iscancel) {
      var uidArrs =
          Object.keys(_getWantOnlineObj(_dbName, socket.decoded_token.uid));

      uidArrs.forEach(function (socketId) {
        if (nspzx.connected[socketId]) {
          socket.broadcast.to(socketId)
              .emit('semit-cancelSomebodyOnline', iscancel);

          if (!iscancel) {
            iscancel = true;
          }
        }
      });
    };

    /*_joinRoom = function (nspzx, socket, _dbName) {
      var roomObj = nspzx.adapter.rooms[_dbName];
      var socketIdArr;

      if (roomObj) {
        socketIdArr = Object.keys(roomObj.sockets);

        socketIdArr.forEach(function (socketId) {
          var socketAnother = nspzx.connected[socketId];

          // 清场！！！
          if (socketAnother.decoded_token.uid ===
              socket.decoded_token.uid) {
            // 直接踢出房间
            _leaveRoom(socketAnother, _dbName);
          }
        });
      }

      dbName = _dbName;
      socket.join(_dbName);
    };

    _leaveRoom = function (socket, _dbName) {
      socket.leave(_dbName);
    };*/

    // first
    // 检测用户相应权限
    User.initUser({
      uid: socket.decoded_token.uid,
      dbName: socket.handshake.query.dbName,
    }, function (results) {
      if (results.success === 1) {
        // user = results.user;

        // 通知客户端并返回客户端城市对应数据库
        // 通过客户端回调，无需用户干预
        // socket.emit('semit-user', user, function (_dbName) {
        //   dbName = _dbName;

        //   // 检查房间是否可以进入, 循环房间内所有账号
        //   // 如果循环第一次找到 userId
        //   // 服务器通知自己有人已经使用此账号进入房间了
        //   // 继续循环，将重复的 userId 踢出房间
        //   // 返回是否可以进入房间 canJoin，
        //   // if canJoin === true, 进入房间
        //   _somebodyIsOnlined(nspzx, socket, dbName);
        // });

        // dbName = results.dbName;
        _somebodyIsOnlined(nspzx, socket, results.dbName);
      }
    });

    // 通知服务器自己想要登录房间
    socket.on('cemit-somebodyWantOnline', function () {
      // 检查房间是否可以进入, 循环房间内所有账号
      // 如果循环第一次找到 userId
      // 服务器通知此账号自己想要登录
      // 继续循环，将重复的 userId 踢出房间
      // 返回是否可以进入房间 canJoin，
      // if canJoin === true, 进入房间
      _somebodyWantOnline(nspzx, socket, dbName);
    });

    // 通知服务器是否拒绝其他人进入房间
    socket.on('cemit-cancelSomebodyOnline', function (iscancel, callback) {
      console.log('-----------BEGIN socket.on cemit-cancelSomebodyOnline');
      console.log(socket.id);
      _cancelSomebodyOnline(nspzx, socket, dbName, iscancel);

      _delWantOnlineObj(dbName, socket.decoded_token.uid);
      callback();
      console.log('-----------END socket.on cemit-cancelSomebodyOnline');
    });

    // 断开连接
    socket.on('disconnect', function () {
      console.log('-------------------socket.on disconnect');
    });
  });
};

module.exports = listen;

// var initConnect = function (socket, decoded, dbName, uid) {
//   // var cookieUser = {
//   //   _id: uid,
//   //   companyId: decoded.company._id,
//   //   socketId: socket.id,
//   //   category: decoded.company.category,
//   //   role: decoded.user.role,
//   // };

//   var checkSys99 = false;
//   var checkSys30 = false;
//   var checkSys20 = false;
//   var checkSys10 = false;
//   var checkCus30 = false;
//   var checkCus20 = false;
//   var checkCus10 = false;
//   var Setplace;
//   var Feestemp;
//   var Dengjipai;
//   var Serverman;

//   // // 保险起见, 强制踢人
//   // if (cookieUsers[dbName][uid]) {
//   //   console.log(cookieUsers[dbName][uid]);
//   //   console.log('---------------------强制下线 initConnect');

//   //   // 强制下线
//   //   io.to(cookieUsers[dbName][uid].socketId).emit('on-kickUser');
//   // }

//   // // add to cookieUsers
//   // cookieUsers[dbName][uid] = cookieUser;

//   // 发送到客户端
//   // socket.emit('connect_decoded', decoded);

//   // 拒绝对方上线请求
//   socket.on('emit-cancelSomebodyOnline', function (sids) {
//     var i;
//     var len = sids.length;

//     for (i = 0; i < len; i += 1) {
//       io.to(sids[i]).emit('on-cancelSomebodyOnline');
//     }
//   });

//   // 统一计算权限
//   if (cookieUser.role === 99) {
//     checkSys99 = true;
//   } else if (cookieUser.category === 30) {
//     if (cookieUser.role === 30) {
//       checkSys30 = true;
//       checkSys20 = true;
//       checkSys10 = true;
//     } else if (cookieUser.role === 20) {
//       checkSys20 = true;
//       checkSys10 = true;
//     } else if (cookieUser.role === 10) {
//       checkSys10 = true;
//     }
//   } else {
//     if (cookieUser.role === 30) {
//       checkCus30 = true;
//       checkCus20 = true;
//       checkCus10 = true;
//     } else if (cookieUser.role === 20) {
//       checkCus20 = true;
//       checkCus10 = true;
//     } else if (cookieUser.role === 10) {
//       checkCus10 = true;
//     }
//   }

//   // 初始化 controllers
//   Setplace = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'setplace');
//   Feestemp = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'feestemp');
//   Dengjipai = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'dengjipai');
//   Serverman = Ctrl.getCtrl(process.env.DB_HOST, dbName, 'serverman');

//   // // echo 测试专用
//   // socket.on('emit-echo', function (msg, callback) {
//   //   callback(msg);
//   // });

//   // 现场责任人 20
//   socket.on('emit-servermanlist', function (obj, callback) {
//     if (checkSys20) {
//       Serverman.list(
//           { company: cookieUser.companyId }, function (results) {
//         callback(results);
//       });
//     } else {
//       callback([]);
//     }
//   });

//   socket.on('emit-servermanadd', function (obj, callback) {
//     if (checkSys20) {
//       Serverman.add(
//         { company: cookieUser.companyId, name: obj.name },
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 11999, errMsg: '权限不够' });
//     }
//   });

//   socket.on('emit-servermanupdate', function (obj, callback) {
//     if (checkSys20) {
//       Serverman.update(
//         { _id: obj.id, company: cookieUser.companyId, name: obj.name },
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 11998, errMsg: '权限不够' });
//     }
//   });

//   socket.on('emit-servermanremove', function (obj, callback) {
//     if (checkSys20) {
//       Serverman.remove(obj.id, function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 11997, errMsg: '权限不够' });
//     }
//   });

//   // 集合地点 30
//   socket.on('emit-setplacelist', function (obj, callback) {
//     if (checkSys30) {
//       Setplace.list({}, function (results) {
//         callback(results);
//       });
//     } else {
//       callback([]);
//     }
//   });

//   // 服务费模板 30
//   socket.on('emit-feestemplist', function (obj, callback) {
//     if (checkSys30) {
//       Feestemp.list({}, function (results) {
//         callback(results);
//       });
//     } else {
//       callback([]);
//     }
//   });

//   socket.on('emit-feestempadd', function (obj, callback) {
//     if (checkSys30) {
//       Feestemp.add(
//         obj,
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 19998, errMsg: '权限不够' });
//     }
//   });

//   socket.on('emit-feestempupdate', function (obj, callback) {
//     if (checkSys30) {
//       Feestemp.update(
//         obj,
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 19998, errMsg: '权限不够' });
//     }
//   });

//   // 登机牌用户 30
//   socket.on('emit-dengjipailist', function (obj, callback) {
//     if (checkSys30) {
//       Dengjipai.list({}, function (results) {
//         callback(results);
//       });
//     } else {
//       callback([]);
//     }
//   });

//   socket.on('emit-dengjipaiadd', function (obj, callback) {
//     if (checkSys30) {
//       Dengjipai.add(
//         { name: obj.name, password: obj.password },
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 12999, errMsg: '权限不够' });
//     }
//   });

//   socket.on('emit-dengjipaiupdate', function (obj, callback) {
//     if (checkSys30) {
//       Dengjipai.update(
//         { _id: obj.id, name: obj.name, password: obj.password },
//         function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 12998, errMsg: '权限不够' });
//     }
//   });

//   socket.on('emit-dengjipairemove', function (obj, callback) {
//     if (checkSys30) {
//       Dengjipai.remove(obj.id, function (results) {
//           callback(results);
//         }
//       );
//     } else {
//       callback({ success: 12997, errMsg: '权限不够' });
//     }
//   });

//   // 在线用户 99
//   socket.on('emit-getusers', function (obj, callback) {
//     var len; // = Object.keys(io.sockets.connected);

//     if (checkSys99) {
//       len = Object.keys(io.sockets.connected).length;
//       callback({ cookieUsers: cookieUsers, clientsLength: len });
//     } else {
//       callback({ cookieUsers: {}, clientsLength: 0 });
//     }
//   });

//   // 断开连接
//   socket.on('disconnect', function () {
//     delete cookieUsers[dbName][uid];
//   });
// };

// One roundtrip
// io.use(ioJwt.authorize({
//   secret: process.env.JWT_TOKEN_SECRET,
//   handshake: true,
// }));

// io.on('connection', function (socket) {
//   var decoded = socket.decoded_token;
//   var dbName = dbNames[decoded.city];
//   var uid = decoded.user._id;
//   // var socketId; // 对方 - 已登陆用户

//   // // 初始化房间
//   // if (!cookieUsers[dbName]) {
//   //   cookieUsers[dbName] = {};
//   // }

//   // 检测是否已经登录
//   // 同一个账号同一城市只能同时登陆一个
//   // if (cookieUsers[dbName][uid]) {
//     // console.log(cookieUsers[dbName][uid]);
//     // console.log('---------------------同一个账号同一城市只能同时登陆一个 connection');

//     // 强制下线
//     // io.to(cookieUsers[dbName][uid].socketId).emit('on-kickUser');

//     // socketId = cookieUsers[dbName][uid].socketId;

//     // 通知自己有人已经使用此账号登录了
//     socket.emit('on-somebodyIsOnlined');

//     // 踢人下线, 自己上线
//     socket.on('emit-somebodyWantOnline', function () {
//       // 通知对方自己想要登录
//       io.to(socketId).emit('on-somebodyWantOnline', socket.id);
//     });

//     // 初始化
//     socket.on('emit-initConnect', function () {
//       initConnect(socket, decoded, dbName, uid);
//     });
//   } else {
//     // 初始化
//     initConnect(socket, decoded, dbName, uid);
//   }
// });
