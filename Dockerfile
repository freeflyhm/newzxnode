FROM node:argon

# Create newzxnode directory
RUN mkdir /newzxnode
WORKDIR /newzxnode

# Install app dependencies
COPY . /newzxnode
RUN npm install -g forever && npm install -g mocha@2.5.3 && npm install

EXPOSE 8081
CMD  forever /newzxnode/server.js