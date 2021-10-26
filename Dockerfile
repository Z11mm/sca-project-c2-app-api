# syntax=docker/dockerfile:1

FROM node:14.18-alpine

WORKDIR /usr/src/faceapp-api

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "prod"]