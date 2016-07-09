FROM node:argon

# Create node directory
RUN mkdir /node
WORKDIR /node

# Install app dependencies
COPY . /node
RUN npm install -g mocha && npm install

EXPOSE 3000
# CMD  forever /node/server.js
# CMD [ "npm", "start" ]