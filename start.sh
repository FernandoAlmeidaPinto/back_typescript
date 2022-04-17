#!/bin/sh

yarn
yarn build
cp .env ./build
cd ./build
yarn install
cd ..
docker-compose up --build -d
yarn migration

pm2 start build/server.js --name vcnafacul
