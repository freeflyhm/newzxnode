[![Build Status](https://secure.travis-ci.org/freeflyhm/newzxnode.png)](travis-ci.org/freeflyhm/newzxnode)
[![Coverage Status](https://coveralls.io/repos/github/freeflyhm/newzxnode/badge.svg?branch=master)](https://coveralls.io/github/freeflyhm/newzxnode?branch=master)
[![Code Climate](https://codeclimate.com/github/freeflyhm/newzxnode/badges/gpa.svg)](https://codeclimate.com/github/freeflyhm/newzxnode)
[![Codeship Status for freeflyhm/newzxnode](https://codeship.com/projects/4f089460-28b2-0134-448a-5600f55ce6ca/status?branch=master)](https://codeship.com/projects/162450)
[![Dependency Status](https://gemnasium.com/badges/github.com/freeflyhm/newzxnode.svg)](https://gemnasium.com/github.com/freeflyhm/newzxnode)

docker build -t joehe/newzxnode:1.0.0 .

开发 --------------------------
docker run -d -p 8081:8081 -v /"$PWD"/app:/newzxnode/app -v /"$PWD"/tests:/newzxnode/tests --link newzxmongo:newzxmongo --link newzxmongotest:newzxmongotest --env DB_HOST=newzxmongo --env DB_HOST_TEST=newzxmongotest --name newzxnode joehe/newzxnode:1.0.0

docker exec -it newzxnode /bin/bash

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

https://codeclimate.com/

https://gemnasium.com/

https://david-dm.org/

https://codeship.com/

https://ci.appveyor.com/

https://saucelabs.com/

https://gitter.im/

https://github.com/mochajs/mocha#backers

https://github.com/mochajs/mocha#sponsors
