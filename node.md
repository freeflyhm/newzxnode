docker build -t joehe/newzxnode:1.0.0 .

docker run -it -p 3000:3000 -v /"$PWD"/tests:/node/tests --name newzxnode joehe/newzxnode:1.0.0 /bin/bash




# 修改时区
docker exec -it newzxnode /bin/bash
date -R
tzselect
5 → 回车 → 9 → 回车 → 1 → 回车 → 1
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
