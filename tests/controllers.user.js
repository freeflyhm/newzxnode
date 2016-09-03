/* jshint
   node: true, devel: true, maxstatements: 32, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, after */

/* controllers/user.js - Mocha controllers/user test */
'use strict';

if (require('./testconf').controllersUser) {
  describe('controllers/user.js', function () {
    var assert = require('assert');
    var dbHost = process.env.DB_HOST_TEST;
    var createCtrl = require('../src/app/controllers/user');
    var User = createCtrl(dbHost, 'sz');

    var companyObj = {
      name: 'testCompany',
      city: '深圳',
    };
    var companyObj10006 = {
      name: 'testCompany1',
      city: '深圳',
    };
    var userObj = {
      userName: 'test',
      password: '123456',
      companyAbbr: 'tt',
      name: '何苗',
      phone: 11111111111,
    };
    var cid;
    var uid;
    var _test;
    var _tests;

    _test = function (test, func) {
      it('success === ' + test.success, function (done) {
        func(test.obj, function (results) {
          assert.strictEqual(results.success, test.success);
          done();
        });
      });
    };

    _tests = function (tests, func) {
      tests.forEach(function (test) {
        _test(test, func);
      });
    };

    describe('_companyFindOneByName', function () {
      var test = {
        obj: { companyObj: { name: {} }, userObj: {} },
        success: 10003,
      };

      _test(test, User._companyFindOneByName);
    });

    describe('_userFindOneByUserName', function () {
      var userObj = { userName: {}, password: '123456' };
      var test = {
        obj: { companyObj: {}, userObj: userObj },
        success: 10005,
      };

      _test(test, User._userFindOneByUserName);
    });

    describe('_newCompanySave', function () {
      var obj = { companyObj: { name: {} }, userObj: {} };
      var test = { obj: obj, success: 10007 };

      _test(test, User._newCompanySave);
    });

    describe('_newUserSave', function () {
      var test = { obj: { userName: {}, password: '123456' }, success: 10008 };

      _test(test, User._newUserSave);
    });

    describe('_comparePassword', function () {
      var obj = { password: {} };
      var resultsUser;

      it('success === 10009', function (done) {
        User._newUserSave({ userName: 'test10009', password: '123456' },
          function (results) {
            resultsUser = results.user;
            User._comparePassword({ user: resultsUser, obj: obj },
              function (results) {
                assert.strictEqual(results.success, 10009);
                done();
              }
            );
          }
        );
      });
    });

    describe('_userFindOneBySearch', function () {
      var tests = [
        { obj: { search: { userName: {} } }, success: 10019 },
        { obj: { search: { userName: 'nobody' } }, success: 10023 },
      ];

      _tests(tests, User._userFindOneBySearch);
    });

    // describe('_feesTempFind', function () {
    //   var test = { neObj: {} };

    //   it('should ok', function (done) {
    //     User._feesTempFind(test, function (result) {
    //       assert.strictEqual(JSON.stringify(result), '{}');
    //       done();
    //     });
    //   });
    // });

    describe('_userUpdate', function () {
      var test = { obj: { _id: {} }, success: 10035 };

      _test(test, User._userUpdate);
    });

    describe('register', function () {
      var tests = [
        { obj: { companyObj: {} }, success: 10010 },
        { obj:
          { companyObj:
            { name: 'company' },
            userObj: {},
          },
          success: 10011,
        },
        {
          obj: {
            companyObj: { name: 'company' },
            userObj: { userName: 'user' },
          },
          success: 10012,
        },
        {
          obj: {
            companyObj: { name: 'company' },
            userObj: { userName: 'user', password: '123456' },
          },
          success: 10013,
        },
        {
          obj: {
            companyObj: { name: 'company' },
            userObj: {
              userName: 'user',
              password: '123456',
              companyAbbr: 'cp',
            },
          },
          success: 10014,
        },
        {
          obj: {
            companyObj: { name: 'company' },
            userObj: {
              userName: 'user',
              password: '123456',
              companyAbbr: 'cp',
              name: '何苗',
            },
          },
          success: 10015,
        },
      ];
      var tests2;

      _tests(tests, User.register);

      it('success === 1', function (done) {
        User.register({ companyObj: companyObj, userObj: userObj },
          function (results) {
            assert.strictEqual(results.success, 1);
            cid = results.user.company;
            uid = results.user._id;
            done();
          }
        );
      });

      tests2 = [
        { obj: { companyObj: companyObj, userObj: userObj }, success: 10004 },
        {
          obj: { companyObj: companyObj10006, userObj: userObj },
          success: 10006,
        },
      ];

      _tests(tests2, User.register);
    });

    describe('update', function () {
      var tests = [
        { obj: { role: 30, userrole: 20 }, success: 10029 },
        { obj: { role: 20, userrole: 30 }, success: 10030 },
        { obj: { role: 20, userrole: 30, name: '何苗' }, success: 10031 },
        {
          obj: { role: 20, userrole: 30, name: '何苗', phone: 11111111111 },
          success: 10032,
        },
        {
          obj: {
            _id: {},
            role: 20,
            userrole: 30,
            name: '何苗',
            phone: 11111111111,
            companyAbbr: 'tt',
          },
          success: 10033,
        },
        {
          obj: {
            role: 20,
            userrole: 30,
            name: '何苗',
            phone: 11111111111,
            companyAbbr: 'tt',
          },
          success: 10034,
        },
      ];

      _tests(tests, User.update);
    });

    describe('changeStatus', function () {
      var tests = [
        { obj: { _id: {} }, success: 10024 },
        { obj: {}, success: 10025 },
      ];

      _tests(tests, User.changeStatus);
    });

    describe('login', function () {
      var userObj10017 = { userName: {} };
      var userObj10018 = { userName: 'ee', password: {} };
      var userObj10016 = { userName: 'test', password: '1234567', city: '深圳' };
      var userObj1 = { userName: 'test', password: '123456', city: '深圳' };

      var tests = [
        { obj: userObj10017, success: 10017 },
        { obj: userObj10018, success: 10018 },
        { obj: userObj1, success: 10022 },
      ];

      _tests(tests, User.login);

      it('success === 10016', function (done) {
        User.changeStatus({ _id: uid, status: true }, function (results) {
          assert.strictEqual(results.success, 1);
          User.login(userObj10016, function (results) {
            assert.strictEqual(results.success, 10016);
            done();
          });
        });
      });

      _test({ obj: userObj1, success: 1 }, User.login);

      it('success === 10020', function (done) {
        User.update({
            _id: uid,
            role: 0,
            userrole: 30,
            name: '何苗',
            phone: 11111111111,
            companyAbbr: 'tt',
          }, function (results) {
            assert.strictEqual(results.success, 1);

            User.login(userObj1, function (results) {
              assert.strictEqual(results.success, 10020);
              done();
            });
          }
        );
      });
    });

    describe('companyUpdate', function () {
      var tests = [
        { obj: {}, success: 10026 },
        { obj: { category: 20, name: 't' }, success: 10027 },
        { obj: { _id: {}, category: 20, name: 'tt' }, success: 10028 },
      ];

      _tests(tests, User.companyUpdate);
    });

    // describe('changeFeesTemp', function () {
    //   var tests = [
    //     { obj: { id: {} }, success: 10036 },
    //     { obj: { id: cid, feestemp: 'dd' }, success: 1 },
    //   ];

    //   _tests(tests, User.changeFeesTemp);
    // });

    describe('companylist', function () {
      it('should err', function (done) {
        User.companylist({ CITY: {} }, function (result) {
          assert(JSON.stringify(result) === '{}');
          done();
        });
      });

      it('should ok', function (done) {
        User.companylist({ CITY: '深圳' }, function (result) {
          assert.strictEqual(typeof result, 'object');
          done();
        });
      });
    });

    describe('initUser', function () {
      it('should === 10021', function (done) {
        var testObj = {
          uid: uid,
          dbName: 'gfz',
        };
        User.update({
          _id: uid,
          role: 20,
          name: '何苗',
          phone: 11111111111,
          companyAbbr: 'tt',
        }, function (results) {
          assert.strictEqual(results.success, 1);

          User.initUser(testObj, function (results) {
            assert.strictEqual(results.success, 10021);
            done();
          });
        });
      });

      it('should ok', function (done) {
        var testObj = {
          uid: uid,
          dbName: 'gz',
        };
        User.update({
          _id: uid,
          role: 20,
          name: '何苗',
          phone: 11111111111,
          companyAbbr: 'tt',
        }, function (results) {
          assert.strictEqual(results.success, 1);

          User.initUser(testObj, function (results) {
            // { success: 1,
            // user:
            //  { _id: 57b6fb534ca9fb6a0087b8bb,
            //    name: '',
            //    company: {
            //      _id: 57b6fb534ca9fb6a0087b8ba,
            //      city: '',
            //      category: 20 },
            //    status: true,
            //    role: 20 } }
            assert.strictEqual(results.success, 1);
            done();
          });
        });
      });
    });

    after(function (done) {
      var Conn = require('../src/app/conn')(dbHost, 'auth');
      var SchemaCompany = require('../src/app/schemas/company');
      var SchemaUser = require('../src/app/schemas/user');
      var CompanyModel = Conn.model('Company', SchemaCompany);
      var UserModel = Conn.model('User', SchemaUser);
      CompanyModel.remove({}, function (err, res) {
        assert.strictEqual(res.result.ok, 1);

        UserModel.remove({}, function (err, res) {
          assert.strictEqual(res.result.ok, 1);
          done();
        });
      });

      // User._remove({}, function (results) {
      //   assert.strictEqual(results.success, 1);
      //   done();
      // });
    });
  });
}
