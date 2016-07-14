/*
 * user.js - Schema user
*/

/* jshint      node:  true, devel:  true, maxstatements: 5, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

// 用户
var SALT_WORK_FACTOR = 10;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(_this.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      _this.password = hash;
      next();
    });
  });
});

// 实例方法
UserSchema.methods = {
  comparePassword: function (_password, cb) {
    bcrypt.compare(_password, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }

      cb(null, isMatch);
    });
  },
};

// 静态方法
UserSchema.statics = {
  findOneByUserName: function (userName, cb) {
    return this.findOne({ userName: userName })
        .exec(cb);
  },
};

module.exports = UserSchema;
