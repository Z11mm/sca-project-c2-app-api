FROM node:14.18-alpine

WORKDIR /usr/src/faceapp-api

COPY . .

RUN npm install

CMD ["npm", "start"]