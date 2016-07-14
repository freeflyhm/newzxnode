/*
 * user.js - Schema user
*/

/* jshint      node:  true, devel:  true, maxstatements: 6, maxparams: 4,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

// 用户
var SALT_WORK_FACTOR = 10;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _bcryptGenSalt = function (bcrypt, SALT_WORK_FACTOR, _this, next) {
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    bcrypt.hash(_this.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      _this.password = hash;
      next();
    });
  });
};

var UserSchema = new Schema({
  // 用户名
  userName: {
    unique: true,
    type: String,
  },
  password: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now(),
    },
    updateAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

UserSchema.pre('save', function (next) {
  var _this = this;

  // if (_this.isNew) {
  //   _this.meta.createAt = _this.meta.updateAt = Date.now();
  // } else {
  //   _this.meta.updateAt = Date.now();
  // }

  _this.meta.createAt = _this.meta.updateAt = Date.now();

  _bcryptGenSalt(bcrypt, SALT_WORK_FACTOR, _this, next);

  // bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
  //   if (err) {
  //     return next(err);
  //   }

  //   bcrypt.hash(_this.password, salt, null, function (err, hash) {
  //     if (err) {
  //       return next(err);
  //     }

  //     _this.password = hash;
  //     next();
  //   });
  // });
});

// 实例方法
UserSchema.methods = {
  comparePassword: function (_password, next) {
    bcrypt.compare(_password, this.password, function (err, isMatch) {
      if (err) {
        return next(err);
      }

      next(null, isMatch);
    });
  },
};

// 静态方法
UserSchema.statics = {
  findOneByUserName: function (userName, next) {
    return this.findOne({ userName: userName })
        .exec(next);
  },

  _bcryptGenSalt: _bcryptGenSalt,
};

module.exports = UserSchema;
