FROM node:argon

# Create newzxnode directory
RUN mkdir /newzxnode
WORKDIR /newzxnode

# Install app dependencies
COPY . /newzxnode
RUN npm config set registry "http://registry.cnpmjs.org"
RUN npm install -g forever && npm install

EXPOSE 8081
CMD  forever /newzxnode/src/server.js
