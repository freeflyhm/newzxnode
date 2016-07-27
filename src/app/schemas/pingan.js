/* jshint
   node: true, devel: true, maxstatements: 6, maxparams: 4,
   maxerr: 50, nomen: true, regexp: true
 */

/**
 * pingan Schema 模块
 * @module app/schemas/pingan
 */
'use strict';

// 保险卡
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var PinganSchema = new Schema({
  pinganCardNum: String,      // 保险卡号
  password: String,           // 密码
  serverMan: String,          // 领用人
  notes: String,              // 备注
  sm: {
    type: ObjectId,
    ref: 'Sm',
  },

  person: ObjectId,
  name: String,         // 姓名
  phone: String,        // 手机
  cardCategory: String, // 证件类型
  cardNum: String,      // 证件号码
  birthday: String,     // 出生日期
  sex: String,          // 性别

  liveTime: Date,       // 激活时间

  // 1 问题卡（该卡已经被使用/卡号不存在） 2 未开卡 3 已开卡
  isInsurance: { type: Number, default: 2 },

  // canUse: { type: Boolean, default: true },  // 能否使用
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

PinganSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  next();
});

module.exports = PinganSchema;
