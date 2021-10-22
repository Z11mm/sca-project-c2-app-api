# syntax=docker/dockerfile:1

FROM node:14.18-alpine

WORKDIR /usr/src/faceapp-api

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prod"]