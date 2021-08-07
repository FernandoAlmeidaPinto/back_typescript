FROM node:14

ENV NODE_ENV=development

COPY /build /var/www

WORKDIR /var/www
