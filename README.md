[![Build Status](https://secure.travis-ci.org/freeflyhm/newzxnode.png)](travis-ci.org/freeflyhm/newzxnode)
[![Code Climate](https://codeclimate.com/github/freeflyhm/newzxnode/badges/gpa.svg)](https://codeclimate.com/github/freeflyhm/newzxnode)
[![Coverage Status](https://coveralls.io/repos/github/freeflyhm/newzxnode/badge.svg?branch=master)](https://coveralls.io/github/freeflyhm/newzxnode?branch=master)

docker build -t joehe/newzxnode:1.0.0 .

开发 --------------------------
docker run -it -p 8080:8080 -v /"$PWD"/app:/newzxnode/app -v /"$PWD"/tests:/newzxnode/tests --name newzxnode joehe/newzxnode:1.0.0 /bin/bash

docker start -i newzxnode

--------------------------
docker run -d -p 8080:8080 -v /"$PWD"/app:/newzxnode/app -v /"$PWD"/tests:/newzxnode/tests --name newzxnode joehe/newzxnode:1.0.0

docker exec -it newzxnode /bin/bash

docker run -d -p 8080:8080 -v /"$PWD"/app:/newzxnode/app -v /"$PWD"/tests:/newzxnode/tests --link mongo:mongo --name newzxnode joehe/newzxnode:1.0.0

--------------------------
# 修改时区
docker exec -it newzxnode /bin/bash
date -R
tzselect
5 → 回车 → 9 → 回车 → 1 → 回车 → 1
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime


图片
https://travis-ci.org/
https://coveralls.io/
https://codeship.com/
https://codeclimate.com/
https://gitter.im/
https://github.com/mochajs/mocha#backers
https://github.com/mochajs/mocha#sponsors
