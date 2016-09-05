/* jshint
   node:  true, devel:  true, maxstatements: 60, maxparams: 6,
   maxerr: 50, nomen: true, regexp: true, maxdepth: 5
 */

/**
 * socket.io 模块
 * @module app/io
 */
'use strict';

// static variable
var _ERRS = {
  servermanadd: '20110',
  servermanupdate: '20111',
  servermanremove: '20112',
  feestempadd: '20190',
  feestempupdate: '20191',
  dengjipaiadd: '20120',
  dengjipaiupdate: '20121',
  dengjipairemove: '20122',
};
var DB_CITY = require('./zxutil').DB_CITY;
var ROOMS = Object.keys(DB_CITY); // Array

// 记录想要登录的客户端
// { '$uid': {'$sid' : true} }
var wantOnlineObj = {};

// 记录在房间的用户
// { uid: userObj }
var onlineObj = {};

// private methods
var _getWantOnlineObj;
var _setWantOnlineObj;
var _delWantOnlineObj;

var _getOnlineObj;
var _setOnlineObj;
var _delOnlineObj;

// module.exports
var listen;

_getWantOnlineObj = function (uid) {
  return wantOnlineObj[uid];
};

_setWantOnlineObj = function (uid, sid) {
  if (!wantOnlineObj[uid]) {
    wantOnlineObj[uid] = {};
  }

  wantOnlineObj[uid][sid] = true;
};

_delWantOnlineObj = function (uid) {
  delete wantOnlineObj[uid];
};

_getOnlineObj = function () {
  return onlineObj;
};

_setOnlineObj = function (userObj) {
  onlineObj[userObj._id] = userObj;
};

_delOnlineObj = function (uid) {
  if (onlineObj[uid]) {
    delete onlineObj[uid];
  }
};

listen = function (serv) {
  var io = require('socket.io').listen(serv);
  var ioJwt = require('socketio-jwt');

  var nspzx = io.of('/nspzx');

  var getCtrl = require('./ctrl');

  // One roundtrip
  nspzx.use(ioJwt.authorize({
    secret: process.env.JWT_TOKEN_SECRET,
    handshake: true,
  }));

  nspzx.on('connection', function (socket) {
    // 记录当前用户
    // { _id: 57b5cbf30ab1983e0002eb9e,
    //   company: { _id: 57b5cbf30ab1983e0002eb9d, city: '', category: 30 },
    //   status: true,
    //   role: 30 }
    var userObj = {};

    var uid = socket.decoded_token.uid;
    var dbName = socket.handshake.query.dbName;

    // 权限
    var checkSys99 = false;
    var checkSys30 = false;
    var checkSys20 = false;
    var checkSys10 = false;
    var checkCus30 = false;
    var checkCus20 = false;
    var checkCus10 = false;

    // Ctrl
    var User;
    var Setplace;
    var Feestemp;
    var Dengjipai;
    var Serverman;
    var Bp;
    var Team;

    // private methods
    var _initUser;
    var _checkUidInRoom;
    var _joinRoom;

    _initUser = function (nspzx, socket, uid, dbName) {
      User = getCtrl(process.env.DB_HOST, dbName, 'user');
      User.initUser({
        uid: uid,
        dbName: dbName,
      }, function (results) {
        var ret;

        if (results.success === 1) {
          userObj = results.user;

          ret = _checkUidInRoom(nspzx, socket, uid);
          if (ret.somebodyInRoom) {
            // -A 服务器通知甲, 乙已经使用此账号进入房间了
            // 是否要踢乙, 由甲决定
            socket.emit('semit-somebodyIsOnlined');
          } else {
            // 加入房间
            _joinRoom(User, nspzx, socket, uid, dbName, userObj);
          }
        } else {
          socket.emit('semit-joinRoomFail', results);
        }
      });
    };

    _checkUidInRoom = function (nspzx, socket, uid) {
      var leni = ROOMS.length;
      var i;
      var roomObj;
      var socketIdArr;
      var lenj;
      var j;
      var socketAnother;

      for (i = 0; i < leni; i += 1) {
        roomObj = socket.adapter.rooms[ROOMS[i]];
        if (roomObj) {
          socketIdArr = Object.keys(roomObj.sockets);
          lenj = socketIdArr.length;
          for (j = 0; j < lenj; j += 1) {
            socketAnother = nspzx.connected[socketIdArr[j]];
            if (socketAnother.id !== socket.id &&
                socketAnother.decoded_token.uid === uid) {

              return {
                somebodyInRoom: true,
                id: socketAnother.id,
              };
            }
          }
        }
      }

      return {
        somebodyInRoom: false,
      };
    };

    _joinRoom = function (User, nspzx, socket, uid, dbName, userObj) {
      // 加入房间前清场
      ROOMS.forEach(function (roomName) {
        var roomObj = socket.adapter.rooms[roomName];
        var socketIdArr;
        if (roomObj) {
          socketIdArr = Object.keys(roomObj.sockets);
          socketIdArr.forEach(function (socketId) {
            var socketAnother = nspzx.connected[socketId];
            if (socketAnother.decoded_token.uid === uid) {
              if (socketAnother.id === socket.id) {
                socketAnother.leave(roomName);
              } else {
                // 通知对方下线
                socket.broadcast.to(socketId)
                    .emit('semit-cancelSomebodyOnline');
              }
            }
          });
        }
      });

      socket.join(dbName);

      _setOnlineObj({
        dbName: dbName,
        _id: userObj._id,
        userName: userObj.userName,
        name: userObj.name,
        status: userObj.status,
        role: userObj.role,
        companyId: userObj.company._id,
        companyCity: userObj.company.city,
        companyCategory: userObj.company.category,
        socketId: socket.id,
      });

      // 服务器通知自己被加入房间
      socket.emit('semit-somebodyIsJoinRoom', userObj);

      // 业务逻辑
      // 统一计算权限
      // 权限
      checkSys99 = false;
      checkSys30 = false;
      checkSys20 = false;
      checkSys10 = false;
      checkCus30 = false;
      checkCus20 = false;
      checkCus10 = false;

      if (userObj.role === 99) {
        checkSys99 = true;
      } else if (userObj.company.category === 30) {
        if (userObj.role === 30) {
          checkSys30 = true;
          checkSys20 = true;
          checkSys10 = true;
        } else if (userObj.role === 20) {
          checkSys20 = true;
          checkSys10 = true;
        } else if (userObj.role === 10) {
          checkSys10 = true;
        }
      } else {
        if (userObj.role === 30) {
          checkCus30 = true;
          checkCus20 = true;
          checkCus10 = true;
        } else if (userObj.role === 20) {
          checkCus20 = true;
          checkCus10 = true;
        } else if (userObj.role === 10) {
          checkCus10 = true;
        }
      }

      // 初始化 controllers
      Setplace  = getCtrl(process.env.DB_HOST, dbName, 'setplace');
      Feestemp  = getCtrl(process.env.DB_HOST, dbName, 'feestemp');
      Dengjipai = getCtrl(process.env.DB_HOST, dbName, 'dengjipai');
      Serverman = getCtrl(process.env.DB_HOST, dbName, 'serverman');
      Bp        = getCtrl(process.env.DB_HOST, dbName, 'bp');

      Team      = require('./model')(process.env.DB_HOST, dbName, 'team');
    };

    // first
    // 检测用户相应权限
    _initUser(nspzx, socket, uid, dbName);

    // -D 服务器收到来自甲的通知，甲想要登录房间
    socket.on('cemit-somebodyWantOnline', function () {
      var ret = _checkUidInRoom(nspzx, socket, uid);

      if (ret.somebodyInRoom) {
        // 记录
        _setWantOnlineObj(uid, socket.id);

        // 服务器广播通乙，甲想要登录
        // 是否拒绝甲, 由乙决定
        socket.broadcast.to(ret.id)
            .emit('sbroadcast-somebodyWantOnline', socket.id);
      }
    });

    // 通知服务器自己进入房间
    socket.on('cemit-somebodyJoinRoom', function () {
      // 加入房间
      _joinRoom(User, nspzx, socket, uid, dbName, userObj);
    });

    // 通知服务器是否拒绝其他人进入房间
    socket.on('cemit-cancelSomebodyOnline', function (iscancel) {
      // console.log('-----------BEGIN socket.on cemit-cancelSomebodyOnline');
      var wantOnlineSocketIdArrs = [];
      var wantOnlineUidObj = _getWantOnlineObj(uid);

      if (wantOnlineUidObj) {
        wantOnlineSocketIdArrs = Object.keys(wantOnlineUidObj);
        _delWantOnlineObj(uid);
      }

      wantOnlineSocketIdArrs.forEach(function (socketId) {
        if (nspzx.connected[socketId]) {

          if (!iscancel) {
            // 通知自己下线
            socket.emit('semit-cancelSomebodyOnline');

            // 则有且仅有一个 iscancel = false
            iscancel = true;
          } else {
            // 通知对方下线
            socket.broadcast.to(socketId).emit('semit-cancelSomebodyOnline');
          }
        }
      });

      // console.log('-----------END socket.on cemit-cancelSomebodyOnline');
    });

    // 切换城市 checkCus10
    socket.on('cemit-changeRoom', function (dbname) {
      dbName = dbname;

      _initUser(nspzx, socket, uid, dbName);
    });

    // 修改密码 checkSys10 or checkCus10
    socket.on('cemit-changePassword', function (obj, callback) {
      if (checkSys10 || checkCus10) {
        User.changePassword(obj, function (result) {
          callback(result);
        });
      } else {
        callback({ success: 30 }); // 权限不够
      }
    });

    // 排班表 checkSys10

    // 保险卡 checkSys10

    // 登机牌 checkSys10

    // 现场责任人 checkSys20
    socket.on('cemit-servermanlist', function (obj, callback) {
      if (checkSys20) {
        Serverman.list(
            { company: userObj.company._id }, function (results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    });

    socket.on('cemit-servermanadd', function (obj, callback) {
      if (checkSys20) {
        Serverman.add(
          { company: userObj.company._id, name: obj.name },
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.servermanadd });
      }
    });

    socket.on('cemit-servermanupdate', function (obj, callback) {
      if (checkSys20) {
        Serverman.update(
          { _id: obj.id, company: userObj.company._id, name: obj.name },
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.servermanupdate });
      }
    });

    socket.on('cemit-servermanremove', function (obj, callback) {
      if (checkSys20) {
        Serverman.remove(obj.id, function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.servermanremove });
      }
    });

    // 排班表管理 checkSys20
    // 往来账管理 checkSys20
    socket.on('cemit-getbplist', function (obj, callback) {
      if (checkSys20) {
        Bp.list(obj, function (result) {
          callback(result);
        });
      } else {
        callback({});
      }
    });

    // 应收款 checkSys20
    socket.on('cemit-getbillsnow', function (obj, callback) {
      if (checkSys20) {
        Bp.getbillsnow(function (result) {
          callback(result);
        });
      } else {
        callback({
          companys: [],
          statements: [],
          sms: [],
          bps: [],
        });
      }
    });

    // 月账单列表 checkSys20
    socket.on('cemit-getbillsitemisedlist', function (obj, callback) {
      if (checkSys20) {
        Bp.billsitemisedlist(obj, function (result) {
          callback(result);
        });
      } else {
        callback({
          companys: [],
          statements: [],
        });
      }
    });

    // -- 月账单明细
    socket.on('cemit-getbillsitemised', function (obj, callback) {
      if (checkSys20) {
        Bp.getbillsitemised(obj, function (result) {
          callback(result);
        });
      } else {
        callback({
          sms: [],
          bps: [],
          companys: [],
          hasStatement: false,
          lastMonthBalance: 0,
          isLock: false,
        });
      }
    });

    // -- 对账单
    socket.on('cemit-getstatement', function (obj, callback) {
      if (checkSys20) {
        Bp.getstatement(obj, function (result) {
          callback(result);
        });
      } else {
        callback({
          statement: null,
          company: null,
        });
      }
    });

    // -- 新建对账单
    socket.on('cemit-statementadd', function (obj, callback) {
      if (checkSys20) {
        Bp.statementadd(obj, function (result) {
          callback(result);
        });
      } else {
        callback({ success: 0 });
      }
    });

    // -- 删除对账单
    socket.on('cemit-statementremove', function (obj, callback) {
      if (checkSys20) {
        Bp.statementremove(obj, function (result) {
          callback(result);
        });
      } else {
        callback({ success: 0 });
      }
    });

    // -- 确认对账单
    socket.on('cemit-statementlock', function (obj, callback) {
      Bp.statementlock(obj, function (result) {
        callback(result);
      });
    });

    // 月账单汇总报表 checkSys20
    socket.on('cemit-getbillstotal', function (obj, callback) {
      if (checkSys20) {
        Bp.getbillstotal(obj, function (result) {
          callback(result);
        });
      } else {
        callback({
          sms: [],
        });
      }
    });

    // 集合地点管理 checkSys30
    socket.on('cemit-setplacelist', function (obj, callback) {
      if (checkSys30) {
        Setplace.list({}, function (results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    });

    // 服务费模板管理 checkSys30
    socket.on('cemit-feestemplist', function (obj, callback) {
      if (checkSys30) {
        Feestemp.list({}, function (results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    });

    socket.on('cemit-feestempadd', function (obj, callback) {
      if (checkSys30) {
        Feestemp.add(
          obj,
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.feestempadd });
      }
    });

    socket.on('cemit-feestempupdate', function (obj, callback) {
      if (checkSys30) {
        Feestemp.update(
          obj,
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.feestempupdate });
      }
    });

    // 登机牌用户管理 checkSys30
    socket.on('cemit-dengjipailist', function (obj, callback) {
      if (checkSys30) {
        Dengjipai.list({}, function (results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    });

    socket.on('cemit-dengjipaiadd', function (obj, callback) {
      if (checkSys30) {
        Dengjipai.add(
          { name: obj.name, password: obj.password },
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.dengjipaiadd });
      }
    });

    socket.on('cemit-dengjipaiupdate', function (obj, callback) {
      if (checkSys30) {
        Dengjipai.update(
          { _id: obj.id, name: obj.name, password: obj.password },
          function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.dengjipaiupdate });
      }
    });

    socket.on('cemit-dengjipairemove', function (obj, callback) {
      if (checkSys30) {
        Dengjipai.remove(obj.id, function (results) {
            callback(results);
          }
        );
      } else {
        callback({ success: _ERRS.dengjipairemove });
      }
    });

    // 公司列表 checkSys30 checkSys99
    socket.on('cemit-companylist', function (obj, callback) {
      if (checkSys30 || checkSys99) {
        User.companylist({ CITY: DB_CITY[dbName] }, function (results) {
          callback(results);
        });
      } else {
        callback({});
      }
    });

    // 用户列表 checkCus10 checkSys10 checkSys99
    socket.on('cemit-userlist', function (obj, callback) {
      var seach;

      if (checkSys30 || checkSys99) {
        seach = { company: ((obj && obj.cid) || userObj.company._id) };
      } else if (checkSys10 || checkCus10) {
        seach = { company: userObj.company._id, status: true };
      }

      if (checkCus10 || checkSys10 || checkSys99) {
        User.list(seach, function (results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    });

    // 在线用户 checkSys99
    socket.on('cemit-getusers', function (obj, callback) {
      var len; // = Object.keys(io.sockets.connected);

      if (checkSys99) {
        len = Object.keys(nspzx.connected).length;
        callback({ cookieUsers: _getOnlineObj(), clientsLength: len });
      } else {
        callback({ cookieUsers: {}, clientsLength: 0 });
      }
    });

    // 断开连接
    socket.on('disconnect', function () {
      _delOnlineObj(uid);
    });
  });
};

module.exports = listen;
