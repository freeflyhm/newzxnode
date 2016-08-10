/* jshint
   node: true,        devel: true,
   maxstatements: 40, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * user controller 模块
 * @module app/controllers/user
 */
'use strict';
var DB_NAMES = {
  sz: true,
  gz: true,
  hz: true,
};

var CITY_DB = {
  '深圳': 'sz',
  '广州': 'gz',
  '杭州': 'hz',
};

var createCtrl = function (dbHost, dbName) {
  var getModel  = require('../model');
  var User      = getModel(dbHost, 'auth', 'user');

  var util      = require('../util');
  var Company   = getModel(dbHost, 'auth', 'company');
  var FeesTemp  = getModel(dbHost, dbName, 'feestemp');

  var _companyFindOneByName;
  var _userFindOneByUserName;
  var _newCompanySave;
  var _newUserSave;
  var _comparePassword;
  var _userFindOneBySearch;
  var _userUpdate;
  var _feesTempFind;
  var register;
  var update;
  var changeStatus;
  var login;
  var companyUpdate;
  var changeFeesTemp;
  var companylist;
  var initUser;

  _companyFindOneByName = function (obj, callback) {
    var companyObj = obj.companyObj;
    var userObj = obj.userObj;

    Company.findOneByName(companyObj.name, function (err, company) {
      if (err) {
        return callback({ success: 10003, errMsg: err.message });
      }

      if (company) {
        return callback({ success: 10004, errMsg: '公司名已存在' });
      } else {
        // 检验 用户 是否存在
        _userFindOneByUserName({ companyObj: companyObj, userObj: userObj },
            callback);
      }
    });
  };

  // 检验 用户 是否存在
  _userFindOneByUserName = function (obj, callback) {
    var companyObj = obj.companyObj;
    var userObj = obj.userObj;

    User.findOneByUserName(userObj.userName, function (err, user) {
      if (err) {
        return callback({ success: 10005, errMsg: err.message });
      }

      if (user) {
        return callback({ success: 10006, errMsg: '用户名已存在' });
      } else {
        // ***所有检验通过，进入正常保存流程***
        // 保存公司
        companyObj.feestemp = '默认';
        _newCompanySave({ companyObj: companyObj, userObj: userObj }, callback);
      }
    });
  };

  // 保存新公司
  _newCompanySave = function (obj, callback) {
    var companyObj = obj.companyObj;
    var userObj = obj.userObj;
    var newCompany = new Company(companyObj);

    newCompany.save(function (err, company) {
      if (err) {
        return callback({ success: 10007, errMsg: err.message });
      }

      // 添加公司 总负责人，用户权限：30
      userObj.role = 30;
      userObj.status = false; // false：审核中（主账户注册后需要管理员审核）
      userObj.company = company._id;

      _newUserSave(userObj, callback);
    });
  };

  // 保存新用户 30权限
  _newUserSave = function (userObj, callback) {
    var newUser = new User(userObj);

    newUser.save(function (err, user) {
      if (err) {
        return callback({ success: 10008, errMsg: err.message });
      }

      callback({ success: 1, user: user }); // ok
    });
  };

  _comparePassword = function (obj, callback) {
    var user = obj.user;
    var password = obj.password;

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return callback({ success: 10009, errMsg: err });
      }

      if (isMatch) { // true
        callback({
          success: 1,
          profile: { uid: user._id },
          dbName: CITY_DB[user.company.city],
        });
      } else {
        callback({ success: 10016, errMsg: '密码错误' });
      }
    });
  };

  _userFindOneBySearch = function (obj, callback) {
    // login
    // search: { userName: 'test' },
    // filter: { company: 1, role: 1, status: 1, password: 1 }
    // password: '123456'
    // -----------------------------
    // init
    // search: { _id: uid }
    // filter: { company: 1, role: 1, status: 1 }
    // dbName: 'sz'

    User.findOne(
      obj.search,
      obj.filter
    ).populate(
      'company',
      { category: 1, city: 1 }
    ).exec(function (err, user) {
      if (err) {
        return callback({ success: 10019, errMsg: err.message });
      }

      if (user) {
        if (user.role === 0) {
          return callback({ success: 10020, errMsg: '禁止登录' });
        } else if (obj.dbName &&
            user.role <= 30 &&
            user.company.category === 30 &&
            CITY_DB[user.company.city] !== obj.dbName) {

          return callback({ success: 10021, errMsg: '禁止登录此城市' });
        }

        // 检查用户状态
        if (user.status === false) {
          return callback({ success: 10022, errMsg: '账号审核中' });
        }

        // 检查密码
        if (obj.password) {
          _comparePassword({ user: user, password: obj.password }, callback);
        } else {
          callback({ success: 1, user: user });
        }
      } else {
        callback({ success: 10023, errMsg: '用户名不存在' });
      }
    });
  };

  _userUpdate = function (userObj, callback) {
    var s = {
      name: userObj.name,
      phone: userObj.phone,
      companyAbbr: userObj.companyAbbr,
      role: userObj.role,
    };

    User.update({ _id: userObj._id }, { $set: s }, function (err, isOk) {
      if (err) {
        return callback({ success: 10035, errMsg: err.message });
      }

      // success 0 or 1
      callback({ success: isOk.ok, userObj: userObj });
    });
  };

  _feesTempFind = function (o, callback) {
    var neObj = o.neObj;
    var companys = o.companys;
    var obj = o.obj;

    FeesTemp.find({ name: neObj }, { name: 1 })
      .exec(function (err, fees) {

        if (err) { return callback({}); }

        callback({
          companys: companys,
          fees: fees,
          obj: obj,
        });
      }
    );
  };

  // register 注册
  register = function (obj, callback) {
    var companyObj = obj.companyObj;
    var userObj = obj.userObj;

    // 检验 companyObj.name 公司名称 isNull、isLength
    if (!(util.validatorCompanyName(companyObj.name))) {
      return callback({ success: 10010, errMsg: '公司名不合法' });
    }

    // 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
    if (!util.validatorUserName(userObj.userName)) {
      return callback({ success: 10011, errMsg: '用户名不合法' });
    }

    // 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
    if (!util.validatorPassword(userObj.password, userObj.userName)) {
      return callback({ success: 10012, errMsg: '密码不合法' });
    }

    // 检验 userObj.companyAbbr 公司简称 isNull、isLength
    if (!util.validatorCompanyAbbr(userObj.companyAbbr)) {
      return callback({ success: 10013, errMsg: '公司简称不合法' });
    }

    // 检验 userObj.name 姓名 isNull、chineseCharacter 自定义验证、isLength
    if (!util.validatorName(userObj.name)) {
      return callback({ success: 10014, errMsg: '姓名不合法' });
    }

    // 检验 userObj.phone 手机号 isNull、phoneNumber 自定义验证
    if (!util.validatorPhoneNumber(userObj.phone)) {
      return callback({ success: 10015, errMsg: '手机号不合法' });
    }

    // 检验 公司 是否存在
    _companyFindOneByName(
      { companyObj: companyObj, userObj: userObj }, callback);
  };

  // update
  update = function (userObj, callback) {
    // 当前用户权限是否大于或等于待更改用户的权限
    if (userObj.role > userObj.userrole) {
      return callback({ success: 10029, errMsg: '用户权限不合法' });
    }

    // 检验 userObj.name 姓名 isNull、chineseCharacter 自定义验证、isLength
    if (!util.validatorName(userObj.name)) {
      return callback({ success: 10030, errMsg: '姓名不合法' });
    }

    // 检验 userObj.phone 手机号 isNull、phoneNumber 自定义验证
    if (!util.validatorPhoneNumber(userObj.phone)) {
      return callback({ success: 10031, errMsg: '手机号不合法' });
    }

    // 检验 userObj.companyAbbr 公司简称 isNull、isLength
    if (!util.validatorCompanyAbbr(userObj.companyAbbr)) {
      return callback({ success: 10032, errMsg: '公司简称不合法' });
    }

    // 检验 用户 是否存在
    User.findById(userObj._id, function (err, user) {
      if (err) {
        // Cast to ObjectId failed for value "[object Object]" at path "_id"
        return callback({ success: 10033, errMsg: err.message });
      }

      if (!user) { // null
        return callback({ success: 10034, errMsg: '用户名不存在' });
      } else {
        // ***所有检验通过，进入正常更新流程***
        _userUpdate(userObj, callback);
      }
    });
  };

  // 状态变更
  changeStatus = function (userObj, callback) {
    var id = userObj._id;
    if (id) {
      User.update({ _id: id }, { $set: { status: userObj.status } },
          function (err, isOk) {
            if (err) {
              return callback({ success: 10024, errMsg: err.message });
            }

            callback({ success: isOk.ok, id: id });
          }
      );
    } else {
      callback({ success: 10025, errMsg: 'checked id, joe' });
    }
  };

  /**
   *  登录
   *  参数
   *    obj: { userName: 'test', password: '123456' }
   *  正常回调
   *    callback({
   *      success: 1,
   *      profile: { uid: user._id },
   *      dbName: CITY_DB[user.company.city],
   *  });
   */
  login = function (obj, callback) {
    // 检验 userObj.userName 用户名 isNull、alnum 自定义验证、isLength
    if (!util.validatorUserName(obj.userName)) {
      return callback({ success: 10017, errMsg: '用户名不合法' });
    }

    // 检验 userObj.password 密码 isNull、isLength、用户名与密码相同
    if (!util.validatorPassword(obj.password, obj.userName)) {
      return callback({ success: 10018, errMsg: '密码不合法' });
    }

    // search: { userName: 'test' },
    // filter: { company: 1, role: 1, status: 1, password: 1 }
    // password: '123456'
    _userFindOneBySearch({
      search: { userName: obj.userName },
      filter: { company: 1, role: 1, status: 1, password: 1 },
      password: obj.password,
    }, callback);
  };

  companyUpdate = function (companyObj, callback) {
    // 检验公司类型
    if (companyObj.category !== 20 && companyObj.category !== 30) {
      return callback({ success: 10026, errMsg: '公司类型不合法' });
    }

    // 检验 companyObj.name 公司名称 isNull、isLength
    if (!(util.validatorCompanyName(companyObj.name))) {
      return callback({ success: 10027, errMsg: '公司名不合法' });
    }

    // 检验通过，更新公司
    Company.update(
      { _id: companyObj._id },
      { $set: {
          name: companyObj.name,
          category: Number(companyObj.category),
          bankCard: companyObj.bankCard,
          isidcard: companyObj.isidcard,
          idcardfee: companyObj.idcardfee,
        },
      }, function (err, isOk) {
        if (err) {
          return callback({ success: 10028, errMsg: err.message });
        }

        // success 0 or 1
        callback({ success: isOk.ok, companyObj: companyObj });
      }
    );
  };

  changeFeesTemp = function (obj, callback) {
    var id = obj.id;
    Company.update({ _id: id },
        { $set: { feestemp: obj.feestemp } }, function (err, isOk) {
      if (err) {
        return callback({ success: 10036, errMsg: err.message });
      }

      callback({ success: isOk.ok, obj: obj });
    });
  };

  companylist = function (obj, callback) {
    if ((obj.category && Number(obj.category) === 30) &&
        (obj.role && Number(obj.role) >= 20)) {

      var search = { city: obj.CITY };

      Company.find(search, function (err, companys) {
        var neObj;

        if (err) { return callback({}); }

        neObj = { $ne: '基础' };

        _feesTempFind({ neObj: neObj,  companys: companys, obj: obj },
            callback);
      });
    } else {
      callback({});
    }
  };

  /**
   *  初始化用户: nspzx.on('connection') 内调用
   *  参数
   *    obj: {
   *      uid: socket.decoded_token.uid,
   *      dbName: socket.handshake.query.dbName,
   *    }
   *  正常回调
   *    callback({
   *      success: 1,
          user: user,
   *    });
   */
  initUser = function (obj, callback) {
    // search: { _id: uid }
    // filter: { company: 1, role: 1, status: 1 }
    // dbName: 'sz'
    if (DB_NAMES[obj.dbName]) {
      _userFindOneBySearch({
        search: { _id: obj.uid },
        filter: { company: 1, role: 1, status: 1 },
        dbName: obj.dbName,
      }, callback);
    } else {
      callback({ success: 10021, errMsg: '城市不合法' });
    }
  };

  return {
    _companyFindOneByName:  _companyFindOneByName,  // 用于测试
    _userFindOneByUserName: _userFindOneByUserName, // 用于测试
    _newCompanySave:        _newCompanySave,        // 用于测试
    _newUserSave:           _newUserSave,           // 用于测试
    _comparePassword:       _comparePassword,       // 用于测试
    _userFindOneBySearch:   _userFindOneBySearch,   // 用于测试
    _userUpdate:            _userUpdate,            // 用于测试
    _feesTempFind:          _feesTempFind,          // 用于测试
    register:               register,
    update:                 update,
    changeStatus:           changeStatus,
    login:                  login,
    companyUpdate:          companyUpdate,
    changeFeesTemp:         changeFeesTemp,
    companylist:            companylist,
    initUser:               initUser,
  };
};

module.exports = createCtrl;
