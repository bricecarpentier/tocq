FROM node:alpine

RUN mkdir -p /srv/app

WORKDIR /srv
COPY package.json package-lock.json ./
# required for building leveldown
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
 && npm install --production --silent \
 && npm install nodemon \
 && apk del .build-deps
ENV PATH /srv/node_modules/.bin:$PATH

WORKDIR /srv/app
COPY . /srv/app/

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

CMD [ "node", "./src/server.js"]