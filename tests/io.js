/* jshint
   node: true, devel: true, maxstatements: 27, maxparams: 4,
   maxerr: 50, nomen: true, regexp: true
 */

/* globals describe, it, before, after */

/* io.js - Mocha io test */
'use strict';

if (require('./testconf').io) {
  describe('io.js', function () {
    var assert = require('assert');

    var PORT = 3000;
    var site = 'http://localhost:' + PORT;

    // var options = {
    //   transports: ['websocket'],
    //   'force new connection': true,
    // };

    var dbHost  = process.env.DB_HOST_TEST;
    var http = require('http');
    var app = require('../src/app/app')(dbHost);

    var superagent = require('superagent');
    var Client = require('socket.io-client');

    var Conn;
    var SchemaCompany;
    var SchemaUser;
    var CompanyModel;
    var UserModel;

    var serv;

    before(function (done) {
      Conn = require('../src/app/conn')(dbHost, 'auth');
      SchemaCompany = require('../src/app/schemas/company');
      SchemaUser = require('../src/app/schemas/user');
      CompanyModel = Conn.model('Company', SchemaCompany);
      UserModel = Conn.model('User', SchemaUser);

      var company1 = new CompanyModel({
        name: 'company1',
        category: 30,
        city: '深圳',
      });

      company1.save(function (err, company) {
        assert.strictEqual(err, null);

        var user1 = new UserModel({
          company: company._id,
          userName: 'user1',
          password: '123456',
          role: 30,
        });

        user1.save(function (err) {
          assert.strictEqual(err, null);

          serv = http.createServer(app);
          require('../src/app/io')(serv);
          serv.listen(PORT);
          done();
        });
      });

    });

    it('should be ok', function (done) {
      superagent.post(site + '/api/login').send({
        userName: 'user1',
        password: '123456',
      }).end(function (err, res) {
        assert.strictEqual(err, null);

        var client1 = Client.connect(site + '/nspzx', {
          query: 'dbName=sz&token=' + res.body.token,
          transports: ['websocket'],
          'force new connection': true,
        });

        // var client2 = Client.connect(site + '/nspzx', {
        //   query: 'token=' + res.body.token,
        //   transports: ['websocket'],
        //   'force new connection': true,
        // });

        client1.on('connect', function () {
          console.log('client1 connect success');
          done();

          // // 通过客户端回调 callback, 无需用户干预
          // client1.on('semit-user', function (obj, callback) {
          //   var citys = { '深圳': 'sz' };

          //   console.log('client1 callback city');
          //   callback(citys[obj.company.city]);
          // });

          // // 服务器通知自己有人已经使用此账号进入房间了
          // // 是否要踢人, 由用户决定
          // client1.on('semit-somebodyIsOnlined', function () {
          //   console.log('client1 semit-somebodyIsOnlined');

          //   // 通知服务器自己想要进入房间
          //   client1.emit('cemit-somebodyWantOnline');
          // });

          // client1.on('semit-cancelSomebodyOnline', function (iscancel) {
          //   console.log('client1 semit-cancelSomebodyOnline: ', iscancel);

          //   done();
          // });
        });

        // client2.on('connect', function () {
        //   console.log('client2 connect success');

        //   // 通过客户端回调 callback, 无需用户干预
        //   client2.on('semit-user', function (obj, callback) {
        //     var citys = { '深圳': 'sz' };

        //     console.log('client2 callback city');
        //     callback(citys[obj.company.city]);
        //   });

        //   // 服务器通知此账号自己想要登录
        //   // 是否拒绝, 由用户决定
        //   client2.on('semit-somebodyWantOnline', function () {
        //     console.log('client2 semit-somebodyWantOnline');

        //     // 通知服务器拒绝其他人进入房间
        //     client2.emit('cemit-cancelSomebodyOnline', true, function () {
        //       console.log('client2 cancelSomebodyOnline ok, do something');
        //     });
        //   });
        // });
      });
    });

    after(function (done) {
      CompanyModel.remove({}, function (err, res) {
        assert.strictEqual(err, null);
        assert.strictEqual(res.result.ok, 1);

        UserModel.remove({}, function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.result.ok, 1);
          serv.close();
          done();
        });
      });
    });
  });
}
