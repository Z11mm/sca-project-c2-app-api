# syntax=docker/dockerfile:1

# use an alpine base image to reduce image size
FROM node:14.18-alpine

# create app directory
WORKDIR /usr/src/faceapp-api

# copy dependencies to serve as a cache layer if no new dependencies are added
COPY package.json .

# install dependencies
RUN npm install

# copy entire app directory
COPY . .

CMD ["npm", "run", "prod"]
