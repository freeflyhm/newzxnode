/* jshint
   node: true,        devel: true,
   maxstatements: 28, maxparams: 3, maxdepth: 2,
   maxerr: 50,        nomen: true,  regexp: true
 */

/**
 * bp controller 模块
 * @module app/controllers/bp
 */
'use strict';

var createCtrl = function (dbHost, dbName) {
  var moment = require('moment');
  var getModel = require('../model');
  var Sm = getModel(dbHost, dbName, 'sm');
  var Bp = getModel(dbHost, dbName, 'bp');
  var Statement = getModel(dbHost, dbName, 'statement');
  var Company = getModel(dbHost, 'auth', 'company');

  // private method
  var _unique;

  // public method
  var list;
  var getbillsnow;
  var billsitemisedlist;
  var getbillsitemised;
  var getstatement;
  var statementadd;
  var statementremove;
  var statementlock;
  var getbillstotal;

  // 数组去重
  _unique = function (arr) {
    var result = [];
    var hash = {};
    var len = arr.length;
    var i;
    var elem;

    for (i = 0; i < len; i += 1) {
      elem = arr[i];

      if (!hash[elem]) {
        result.push(elem);
        hash[elem] = true;
      }
    }

    return result;
  };

  // /bplist/:bpmonth/:bpcompany/:n 往来账
  list = function (obj, callback) {
    // obj = { bpmonth: 'all', bpcompany: 'all', n: '0' };
    // obj.bpMonth 月份 2015-04
    // obj.bpcompany 公司ID
    var LIMIT     = 20;
    var pageN     = Number(obj.n);
    var bpcompany = obj.bpcompany;
    var bpmonth   = obj.bpmonth;
    var index     = pageN * LIMIT;
    var search    = {};
    var sortJson = { _id: -1 };

    Company.find(
      { category: 20 },
      { name: 1 }
    ).sort({ name: 1 }).exec(function (err, companys) {

      if (err) { console.log(err); }

      if (companys) {
        if (bpcompany !== 'all') {
          search.company = bpcompany;
        }

        if (bpmonth !== 'all') {
          search.bpDate =
              { $gte: moment(bpmonth), $lt: moment(bpmonth).add(1, 'M') };
        }

        Bp.count(search, function (err, len) {
          if (err) { console.log(err); }

          Bp.find(search)
            .sort(sortJson)
            .skip(index)
            .limit(LIMIT)
            .exec(
              function (err, bps) {

                if (err) { console.log(err); }

                callback({
                  bps: bps,
                  companys: companys,
                  totalPage: Math.ceil(len / LIMIT), // 向上取整
                });
              }
            );
        });
      }
    });
  };

  // 应收款 20
  getbillsnow = function (callback) {
    var bpmonth     = moment().startOf('month');
    var lastMonth   = moment().startOf('month').subtract(1, 'M');
    var nextMonth   = moment().startOf('month').add(1, 'M');
    var matchSm    = {};
    var matchBp    = {};
    var companyIds;
    var statementCompanyIds;
    var smCompanyIds;
    var bpCompanyIds;

    // 上月余额
    // 查找上月对账单
    Statement.find(
      { month: lastMonth },
      { company: 1, thisMonthBalance:1 },
      function (err, statements) {
        if (err) { console.log(err); }

        /*[
            {
              _id: 55951810b77f37dd3672890f,
              company: 553a55db64d7dffc4b7dce82,
              thisMonthBalance: 58400,
              meta: {},
            },
            {
              _id: 55966bc9b77f37dd36728d83,
              company: 553a55db64d7dffc4b7dce8d,
              thisMonthBalance: 30000,
              meta: {},
            }
        ]*/

        statementCompanyIds = statements.map(function (item) {
          return item.company;
        });

        // 聚合 本月服务单 已收或已付 > 0
        //matchSm['flight.flightDate'] = { $regex : '^' + bpmonth };
        matchSm['flight.flightDate'] =
            { $gte: bpmonth.toDate(), $lt: nextMonth.toDate() };

        matchSm.smStatus = { $gt: 0 };
        matchSm.$or =
            [{ smAgencyFund_y: { $lt: 0 } }, { smPayment_y: { $gt: 0 } }];
        Sm.aggregate([
          {
            $match: matchSm,
          },
          {
            $project: {
              company: 1,
              smAgencyFund_y: 1,
              smPayment_y: 1,
            },
          },
          {
            $group:{
              _id:'$company',
              smAgencyFund_y_sum: { $sum:'$smAgencyFund_y' },
              smPayment_y_sum: { $sum:'$smPayment_y' },
            },
          },
        ])
        .exec(function (err, sms) {
          if (err) { console.log(err); }

          /*[
              {
                _id: 553a55db64d7dffc4b7dce85,
                smAgencyFund_y_sum: -75000,
                smPayment_y_sum: 0,
              },
              {
                _id: 553a55db64d7dffc4b7dce5e,
                smAgencyFund_y_sum: 0,
                smPayment_y_sum: 54000,
              }
          ]*/
          smCompanyIds = sms.map(function (item) {
            return item._id;
          });

          // 聚合 本月往来账
          //matchBp.bpDate = { $regex : '^' + bpmonth };
          //console.log(bpmonth.format('YYYY-MM-DD'));
          //console.log(nextMonth.format('YYYY-MM-DD'));
          matchBp.bpDate = { $gte: bpmonth.toDate(), $lt: nextMonth.toDate() };

          Bp.aggregate([
            {
              $match: matchBp,
            },
            {
              $project: {
                company: 1,
                bpNum: 1,
              },
            },
            {
              $group:{
                _id:'$company',
                bpNum_sum: { $sum:'$bpNum' },
              },
            },
          ]).exec(function (err, bps) {
            if (err) { console.log(err); }

            /*[
                { _id: 553a55db64d7dffc4b7dce7e, bpNum_sum: -17000 },
                { _id: 5549819ffffc6ba533e32d9a, bpNum_sum: -30200 }
            ]*/
            bpCompanyIds = bps.map(function (item) {
              return item._id;
            });

            companyIds =
                _unique(statementCompanyIds.concat(smCompanyIds, bpCompanyIds));

            Company.find(
              { _id: { $in: companyIds } },
              { name: 1 },
              function (err, companys) {
                if (err) { console.log(err); }

                callback({
                  companys: companys,
                  statements: statements,
                  sms: sms,
                  bps: bps,
                });
              }
            );
          });
        });
      }
    );
  };

  // 月账单列表 20
  billsitemisedlist = function (obj, callback) {
    var searchSm = {};
    var searchBp = {};
    var searchStatement = {};
    var companyIds = [];

    if (obj.bpmonth === '') {
      obj.bpmonth = moment().format('YYYY-MM');
    }

    searchSm['flight.flightDate'] =
        { $gte: moment(obj.bpmonth), $lt: moment(obj.bpmonth).add(1, 'M') };
    searchSm.smStatus = { $gt: 0 };

    searchBp.bpDate =
        { $gte: moment(obj.bpmonth), $lt: moment(obj.bpmonth).add(1, 'M') };

    searchStatement.month = moment(obj.bpmonth).subtract(1, 'M'); // 减 1 个月
    searchStatement.thisMonthBalance = { $ne: 0 };

    // 本月服务单公司去重
    Sm.find(searchSm).distinct('company').exec(function (err, smCompanyIds) {
      if (err) { console.log(err); }

      // 本月往来账公司去重
      Bp.find(searchBp).distinct('company').exec(function (err, bpCompanyIds) {
        if (err) { console.log(err); }

        // 上月对账单本月余额 {thisMonthBalance: {$not:0}} 公司
        Statement.find(searchStatement).distinct('company').exec(
          function (err, statementCompanyIds) {
            if (err) { console.log(err); }

            // 合并三个数组并去重
            companyIds =
                _unique(smCompanyIds.concat(bpCompanyIds, statementCompanyIds));

            Company.find(
              { _id: { $in: companyIds } },
              { name: 1 },
              function (err, companys) {
                if (err) { console.log(err); }

                // 查找本月对账单
                Statement.find(
                  { month: moment(obj.bpmonth) },
                  { company: 1, isLock: 1, thisMonthBalance:1 },
                  function (err, statements) {
                    if (err) { console.log(err); }

                    callback({
                      companys: companys,
                      statements: statements,
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  };

  // -- 月账单明细
  getbillsitemised = function (obj, callback) {
    var searchSm             = {};
    var searchBp             = {};
    var searchStatement      = {};
    var searchStatementLast = {};
    var sortJson             = { bpDate: 1 };

    // Company.find({ category: 20 }, { name: 1, idcardfee: 1 }).exec(
    Company.findOne(
      { _id: obj.bpcompany },
      { name: 1, idcardfee: 1 }).exec(

      //function (err, companys) {
      function (err, company) {
        if (err) { console.log(err); }

        if (company) {
          // if (obj.bpcompany === '') {
          //   obj.bpcompany = companys[0]._id;
          // }

          searchSm.company = obj.bpcompany;
          searchBp.company = obj.bpcompany;
          searchStatement.company = obj.bpcompany;
          searchStatementLast.company = obj.bpcompany;

          if (obj.bpmonth === '') {
            obj.bpmonth = moment().format('YYYY-MM');
          }

          //searchSm['flight.flightDate'] = { $regex : '^' + obj.bpmonth };
          searchSm['flight.flightDate'] = {
            $gte: moment(obj.bpmonth),
            $lt: moment(obj.bpmonth).add(1, 'M'),
          };

          //searchBp.bpDate = { $regex : '^' + obj.bpmonth };
          searchBp.bpDate = {
            $gte: moment(obj.bpmonth),
            $lt: moment(obj.bpmonth).add(1, 'M'),
          };

          searchStatement.month = moment(obj.bpmonth);
          searchStatementLast.month = moment(obj.bpmonth).subtract(1, 'M');

          searchSm.smStatus = { $gt: 0 };

          //团队单费用明细表
          Sm.find(
            searchSm,
            {
              team: 1,
              flight: 1,
              operator: 1,
              smType2: 1,
              smRealNumber: 1,
              smAgencyFund_y: 1,
              smPayment_y: 1,
              fees: 1,
              addFees: 1,
              addFeesNote: 1,
              carFees: 1,
              idcardsmfees: 1,
              insurance: 1,
              serverMan: 1,
            }
          ).populate('team', 'teamNum teamType').sort({
            'flight.flightDate': 1,
          }).exec(function (err, sms) {
            if (err) { console.log(err); }

            if (!sms) {
              sms = [];
            }

            // 收支明细表
            Bp.find(searchBp).sort(sortJson).exec(function (err, bps) {

              if (err) { console.log(err); }

              if (!bps) {
                bps = [];
              }

              // 是否有对账单
              Statement.findOne(searchStatement, function (err, statement) {
                var hasStatement;

                if (err) { console.log(err); }

                if (statement) {
                  hasStatement = true;
                } else {
                  hasStatement = false;
                }

                // 是否有上月对账单，如果有，拿到上月对账单的本月余额thisMonthBalance
                Statement.findOne(
                  searchStatementLast,
                  { thisMonthBalance: 1, isLock: 1 },
                  function (err, statement) {
                    var isLock = false;
                    var lastMonthBalance;

                    if (err) { console.log(err); }

                    if (statement) {
                      lastMonthBalance = statement.thisMonthBalance;
                      isLock           = statement.isLock;
                    }

                    callback({
                      sms: sms,
                      bps: bps,
                      company: company,
                      hasStatement: hasStatement,
                      lastMonthBalance: lastMonthBalance,
                      isLock: isLock,
                    });
                  }
                );
              });
            });
          });
        }
      }
    );
  };

  // -- 对账单
  getstatement = function (obj, callback) {
    Statement.findOne({ _id: obj.id }, function (err, statement) {
      if (err) { console.log(err); }

      Company.findOne(
        { _id: statement.company },
        { name: 1 },
        function (err, company) {
          if (err) { console.log(err); }

          callback({
            statement: statement,
            company: company,
          });
        }
      );
    });

    // if (obj.bpmonth === '') {
    //   obj.bpmonth = moment().format('YYYY-MM');
    // }

    // Statement.find(
    //   { month: moment(obj.bpmonth) },
    //   { company: 1 }
    // ).sort({ company: -1 }).exec(function (err, companyArr) {
    //   var companyIds;

    //   if (err) { console.log(err); }

    //   if (companyArr.length === 0) {

    //     callback({
    //       companys: companyArr,
    //       statement: null,
    //     });
    //   } else {
    //     companyIds = companyArr.map(function (item) {
    //       return item.company;
    //     });

    //     Company.find(
    //       { _id: { $in: companyIds } },
    //       { name: 1 },
    //       function (err, comps) {
    //         var companyObj = {};
    //         var companys;

    //         if (err) { console.log(err); }

    //         if (comps) {
    //           comps.forEach(function (item) {
    //             companyObj[item._id] = item;
    //           });

    //           companys = companyArr.map(function (item) {
    //             var _doc = item._doc;
    //             _doc.company = companyObj[_doc.company];
    //             return _doc;
    //           });

    //           if (obj.bpcompany === '') {
    //             obj.bpcompany = companys[0].company._id;
    //           }

    //           Statement.findOne(
    //             { month: moment(obj.bpmonth), company: obj.bpcompany },
    //             function (err, statement) {
    //               if (err) { console.log(err); }

    //               if (statement) {
    //                 callback({
    //                   companys: companys,
    //                   statement: statement,
    //                 });
    //               } else {
    //                 callback({
    //                   companys: companys,
    //                   statement: null,
    //                 });
    //               }
    //             }
    //           );
    //         }
    //       }
    //     );
    //   }
    // });
  };

  // -- 新建对账单
  statementadd = function (obj, callback) {
    var newStatement;

    obj.month = moment(obj.month);

    newStatement = new Statement(obj);

    newStatement.save(function (err, statement) {
      if (err) {
        console.log(err);
      }

      if (statement) {
        callback({ success: 1 }); // ok
        return;
      }

      callback({ success: 0 }); // 未知错误
    });
  };

  // -- 删除对账单
  statementremove = function (obj, callback) {
    var id = obj.id;

    if (id) {
      Statement.remove({ _id: id }, function (err, isOk) {
        if (err) { console.log(err); }

        callback({ success: isOk.result.ok }); // ok
      });
    }
  };

  // -- 确认对账单
  statementlock = function (obj, callback) {
    var id = obj.id;

    if (id) {
      Statement.update(
        { _id: id },
        { $set: { isLock: true } },
        function (err, isOk) {
          if (err) { console.log(err); }

          callback({ success: isOk.ok }); // ok
        }
      );
    }
  };

  // 月账单汇总 20
  getbillstotal = function (obj, callback) {
    var searchSm = {};

    if (obj.bpmonth === '') {
      obj.bpmonth = moment().format('YYYY-MM');
    }

    searchSm['flight.flightDate'] =
        { $gte: moment(obj.bpmonth), $lt: moment(obj.bpmonth).add(1, 'M') };

    searchSm.smStatus = { $gt: 0 };

    //服务单费用明细表
    Sm.find(
      searchSm,
      {
        team: 1,
        company: 1,
        flight: 1,
        smRealNumber: 1,
        fees: 1,
        addFees: 1,
        idcardsmfees: 1,
        serverMan: 1,
        insurance: 1,
      }
    ).populate('team', 'teamType').exec(function (err, smsArr) {
      var sms = [];
      var companyIds;

      if (err) { console.log(err); }

      if (!smsArr) {
        callback({
          sms: sms,
        });
      } else {
        companyIds = smsArr.map(function (item) {
          return item.company;
        });

        Company.find(
          { _id: { $in: companyIds } },
          { name: 1 },
          function (err, companys) {
            var companyObj = {};

            if (err) { console.log(err); }

            if (companys) {
              companys.forEach(function (item) {
                companyObj[item._id] = item;
              });

              sms = smsArr.map(function (item) {
                var _doc = item._doc;
                _doc.company = companyObj[_doc.company];
                return _doc;
              });

              callback({
                sms: sms,
              });
            }
          }
        );
      }
    });
  };

  return {
    list: list,
    getbillsnow: getbillsnow,
    billsitemisedlist: billsitemisedlist,
    getbillsitemised: getbillsitemised,
    getstatement: getstatement,
    statementadd: statementadd,
    statementremove: statementremove,
    statementlock: statementlock,
    getbillstotal: getbillstotal,
  };
};

module.exports = createCtrl;
