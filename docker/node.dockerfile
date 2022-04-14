FROM node:14-bullseye
RUN npm install -g pm2
COPY /build /var/www
WORKDIR /var/www
ENV NODE_ENV=development

