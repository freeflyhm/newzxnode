/*
 * controllers/user.js - Mocha controllers/user test
*/

/* jshint      node:  true, devel:  true, maxstatements: 12, maxparams: 3,
   maxerr: 50, nomen: true, regexp: true */

/* globals describe, it, after */

'use strict';

var assert = require('assert');

// describe('app/controllers/user.js', function () {
//   var UserCtrl = require('../app/controllers/user');
//   var User = UserCtrl.createCtrl(process.env.DB_HOST_TEST, 'auth');

//   describe('_companyFindOneByName', function () {
//     var companyObj = { name: {} };
//     var userObj = {};

//     it('should err 10003', function (done) {
//       User._companyFindOneByName(companyObj, userObj, function (results) {
//         assert.strictEqual(results.success, 10003);
//         done();
//       });
//     });
//   });

//   describe('_userFindOneByUserName', function () {
//     var userObj = { userName: {}, password: '123456' };

//     it('should err 10005', function (done) {
//       User._userFindOneByUserName({}, userObj, function (results) {
//         assert.strictEqual(results.success, 10005);
//         done();
//       });
//     });
//   });

//   describe('_newCompanySave', function () {
//     var companyObj = { name: {} };

//     it('should err 10007', function (done) {
//       User._newCompanySave(companyObj, {}, function (results) {
//         assert.strictEqual(results.success, 10007);
//         done();
//       });
//     });
//   });

//   describe('_newUserSave', function () {
//     var userObj = { userName: {}, password: '123456' };

//     it('should err 10008', function (done) {
//       User._newUserSave(userObj, function (results) {
//         assert.strictEqual(results.success, 10008);
//         done();
//       });
//     });
//   });

//   describe('_comparePassword', function () {
//     var obj = { password: {} };
//     var resultsUser;

//     it('should err 10009', function (done) {
//       User._newUserSave({ userName: 'test10009', password: '123456' },
//         function (results) {
//           resultsUser = results.user;
//           User._comparePassword(resultsUser, obj, function (results) {
//             assert.strictEqual(results.success, 10009);
//             done();
//           });
//         }
//       );
//     });

//     after(function (done) {
//       User._removeUser(resultsUser._id, 1, function (results) {
//         assert.strictEqual(results.success, 1);
//         done();
//       });
//     });
//   });

//   describe('_userFindOneInLogin', function () {
//     var userObj10019 = { userName: {} };
//     var userObj10023 = { userName: 'nobody' };

//     it('should err 10019', function (done) {
//       User._userFindOneInLogin(userObj10019, function (results) {
//         assert.strictEqual(results.success, 10019);
//         done();
//       });
//     });

//     it('should err 10023', function (done) {
//       User._userFindOneInLogin(userObj10023, function (results) {
//         assert.strictEqual(results.success, 10023);
//         done();
//       });
//     });
//   });

//   describe('register', function () {
//     var tests10010 = [
//       { companyObj: {} },
//       { companyObj: { name: 't' } },
//       { companyObj: { name: '1234567890123456' } },
//       { companyObj: { name: {} } },
//     ];

//     var tests10011 = [
//       { companyObj: { name: 'tt' }, userObj: {} },
//       { companyObj: { name: 'tt' }, userObj: { userName: 't' } },
//       { companyObj: { name: 'tt' }, userObj: { userName: '1234567890123456' } },
//       { companyObj: { name: 'tt' }, userObj: { userName: {} } },
//     ];

//     var tests10012 = [
//       {
//         companyObj: { name: 'tt' },
//         userObj: { userName: 'tt' },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: { userName: 'tt', password: '12345' },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: { userName: '123456', password: '123456' },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: { userName: 'tt', password: '123456789012345678901' },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: { userName: 'tt', password: {} },
//       },
//     ];

//     var tests10013 = [
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: {},
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 't',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: '123456789',
//         },
//       },
//     ];

//     var tests10014 = [
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: {},
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: 'tt',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和范德萨的',
//         },
//       },
//     ];

//     var tests10015 = [
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和没',
//           phone: {},
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和没',
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和没',
//           phone: 1234567890,
//         },
//       },
//       {
//         companyObj: { name: 'tt' },
//         userObj: {
//           userName: 'tt',
//           password: '123456',
//           companyAbbr: 'tt',
//           name: '和没',
//           phone: '12345678901',
//         },
//       },
//     ];

//     tests10010.forEach(function (test) {
//       it('should err 10010 companyObj.name = ' + test.companyObj.name,
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10010);
//             done();
//           });
//         });
//     });

//     tests10011.forEach(function (test) {
//       it('should err 10011 userObj.userName = ' + test.userObj.userName,
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10011);
//             done();
//           });
//         });
//     });

//     tests10012.forEach(function (test) {
//       it('should err 10012 userObj.password = ' + test.userObj.password,
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10012);
//             done();
//           });
//         });
//     });

//     tests10013.forEach(function (test) {
//       it('should err 10013 userObj.companyAbbr = ' + test.userObj.companyAbbr,
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10013);
//             done();
//           });
//         });
//     });

//     tests10014.forEach(function (test) {
//       it('should err 10014 userObj.name',
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10014);
//             done();
//           });
//         });
//     });

//     tests10015.forEach(function (test) {
//       it('should err 10015 userObj.phone = ' + test.userObj.phone,
//         function (done) {
//           User.register(test, function (results) {
//             assert.strictEqual(results.success, 10015);
//             done();
//           });
//         });
//     });

//     // it('should err 98', function (done) {
//     //   User.register(obj98, function (results) {
//     //     assert.strictEqual(results.success, 98);
//     //     done();
//     //   });
//     // });
//   });

//   describe('login', function () {
//     var userObj10017 = { userName: {} };
//     var userObj10018 = { userName: 'ee', password: {} };

//     it('should err 10017', function (done) {
//       User.login(userObj10017, function (results) {
//         assert.strictEqual(results.success, 10017);
//         done();
//       });
//     });

//     it('should err 10018', function (done) {
//       User.login(userObj10018, function (results) {
//         assert.strictEqual(results.success, 10018);
//         done();
//       });
//     });
//   });

//   describe('_removeUser', function () {
//     var id = {};

//     it('should err 10000', function (done) {
//       User._removeUser(id, 1, function (results) {
//         assert.strictEqual(results.success, 10000);
//         done();
//       });
//     });
//   });

//   describe('_remove', function () {
//     it('should err 10002', function (done) {
//       User._remove(null, null, function (results) {
//         assert.strictEqual(results.success, 10002);
//         done();
//       });
//     });

//     it('should err 10001', function (done) {
//       User._remove({}, 'ee', function (results) {
//         assert.strictEqual(results.success, 10001);
//         done();
//       });
//     });
//   });
// });
