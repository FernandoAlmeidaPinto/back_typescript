#!/bin/sh

yarn build
cp .env ./build
cd ./build
yarn install
cd ..
docker-compose up --build -d