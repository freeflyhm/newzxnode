# newzxnode

[![Build Status](https://travis-ci.org/freeflyhm/newzxnode.svg?branch=master)](https://travis-ci.org/freeflyhm/newzxnode)
[![Coverage Status](https://coveralls.io/repos/github/freeflyhm/newzxnode/badge.svg?branch=master)](https://coveralls.io/github/freeflyhm/newzxnode?branch=master)
[![Code Climate](https://codeclimate.com/github/freeflyhm/newzxnode/badges/gpa.svg)](https://codeclimate.com/github/freeflyhm/newzxnode)
[![Codeship Status for freeflyhm/newzxnode](https://codeship.com/projects/4f089460-28b2-0134-448a-5600f55ce6ca/status?branch=master)](https://codeship.com/projects/162450)
[![Dependency Status](https://gemnasium.com/badges/github.com/freeflyhm/newzxnode.svg)](https://gemnasium.com/github.com/freeflyhm/newzxnode)

newzxnode 是 full REST API 服务

## ERRORS

编码 10| message - file: ~/app/controllers/user.js
-------|---------------------------------------------------------
10000  | _removeUser - User.remove err
10001  | _remove - Company.remove err
10002  | _remove - checked cid && uid, joe
10003  | _companyFindOneByName - Company.findOneByName err
10004  | _companyFindOneByName - 公司名已存在
10005  | _userFindOneByUserName - User.findOneByUserName err
10006  | _userFindOneByUserName - 用户名已存在
10007  | _newCompanySave - newCompany.save err
10008  | _newUserSave - newUser.save err
10009  | _comparePassword - user.comparePassword err
10010  | register - 公司名不合法
10011  | register - 用户名不合法
10012  | register - 密码不合法
10013  | register - 公司简称不合法
10014  | register - 姓名不合法
10015  | register - 手机号不合法
10016  | _comparePassword - 密码错误
10017  | login - 用户名不合法
10018  | login - 密码不合法
10019  | _userFindOneInLogin - User.findOne err
10020  | _userFindOneInLogin - 禁止登录
10021  | _userFindOneInLogin - 禁止登录此城市
10022  | _userFindOneInLogin - 账号审核中
10023  | _userFindOneInLogin - 用户名不存在
10024  | changeStatus - User.update err
10025  | changeStatus - checked id, joe
10026  | companyUpdate - 公司类型不合法
10027  | companyUpdate - 公司名不合法
10028  | companyUpdate - Company.update err
10029  | update - 用户权限不合法
10030  | update - 姓名不合法
10031  | update - 手机号不合法
10032  | update - 公司简称不合法
10033  | update - User.findById err
10034  | update - 用户名不存在
10035  | update - User.update err
10036  | changeFeesTemp - Company.update err

编码 11| message - file: ~/app/controllers/serverman.js
-------|---------------------------------------------------------
11000  | add - newServerman.save err