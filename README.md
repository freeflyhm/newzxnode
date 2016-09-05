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

编码 11| message - file: ~/app/controllers/serverman.js -> ok
-------|---------------------------------------------------------
11990  | _objSaveObjSaveErr
11980  | listServermanFindErr
11970  | _findOneServermanFindOneErr
11960  | _updateSaveServermanFindOneErr
11950  | removeServermanRemove
11040  | _findOneNameExist
11060  | _validatorValidatorName

编码 12| message - file: ~/app/controllers/dengjipai.js -> ok
-------|---------------------------------------------------------
12990  | _objSaveObjSaveErr
12980  | listDengjipaiFindErr
12970  | _findOneByNameDengjipaiFindOneErr
12960  | _findOneByIdDengjipaiFindOneErr
12950  | removeDengjipaiRemove
12040  | _addSaveNameExist
12050  | _updateSaveNameExist
12060  | _validatorValidatorName
12061  | _validatorValidatorPassword

编码 13| message - file: ~/app/controllers/flag.js
-------|---------------------------------------------------------
13000  | _newSave - newObj.save err
13001  | update - Flag.findByIdAndUpdate err
13002  | remove - Flag.remove err
13003  | add - Flag.findOne err
13004  | add - 旗子 - 已存在！

编码 14| message - file: ~/app/controllers/guest.js
-------|---------------------------------------------------------
14000  | _newSave - newObj.save err
14001  | update - Guest.findByIdAndUpdate err
14002  | remove - Guest.remove err
14003  | add - Guest.findOne err
14004  | add - 收客单位 - 已存在！

编码 15| message - file: ~/app/controllers/guide.js
-------|---------------------------------------------------------
15000  | _newSave - newObj.save err
15001  | update - Guide.findByIdAndUpdate err
15002  | remove - Guide.remove err
15003  | add - Guide.findOne err
15004  | add - 地接人员 - 已存在！

编码 16| message - file: ~/app/controllers/idcardsm.js
-------|---------------------------------------------------------
16999  | add - newObj.save err

编码 17| message - file: ~/app/controllers/operator.js
-------|---------------------------------------------------------
17000  | _newSave - newObj.save err
17001  | update - Operator.findByIdAndUpdate err
17002  | remove - Operator.remove err
17003  | add - Operator.findOne err
17004  | add - 团队操作人 - 已存在！

编码 18| message - file: ~/app/controllers/setplace.js -> ok
-------|---------------------------------------------------------
18990  | listSetPlaceFindErr

编码 19| message - file: ~/app/controllers/feestemp.js -> ok
-------|---------------------------------------------------------
19990  | _objSaveObjSaveErr
19980  | listFeesTempFindErr
19970  | updateFeesTempFindOneErr

编码 20| message - file: ~/app/io.js
-------|---------------------------------------------------------
20110  | servermanadd
20111  | servermanupdate
20112  | servermanremove
20120  | dengjipaiadd
20121  | dengjipaiupdate
20122  | dengjipairemove
20190  | feestempadd
20191  | feestempupdate
