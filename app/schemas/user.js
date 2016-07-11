/*
 * user.js - Schema user
*/

/* jshint      node:  true, devel:  true, maxparams: 2,
   maxerr: 50, nomen: true, regexp: true */

'use strict';

// 用户
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  // 用户名
  userName: {
    unique: true,
    type: String,
  },
  password: String,
});

// 静态方法
UserSchema.statics = {
  findOneByUserName: function (userName, cb) {
    return this.findOne({ userName: userName })
        .exec(cb);
  },
};

module.exports = UserSchema;
