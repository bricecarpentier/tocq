FROM node:alpine

RUN mkdir /code
WORKDIR /code

COPY package.json yarn.lock /code/
RUN yarn install --no-cache

COPY . /code
