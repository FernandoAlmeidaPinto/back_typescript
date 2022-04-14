FROM nginx:stable
RUN addgroup --system www && adduser --system --ingroup www www
COPY /docker/config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
