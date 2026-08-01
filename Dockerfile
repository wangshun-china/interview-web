FROM node:24-alpine

RUN apk add --no-cache nginx curl \
    && mkdir -p /etc/nginx/conf.d /run/nginx \
    && rm -f /etc/nginx/http.d/default.conf

WORKDIR /app
COPY ops ./ops
COPY dist /usr/share/nginx/html
COPY deploy/nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/container-entrypoint.sh /usr/local/bin/wangshun-entrypoint

RUN chmod 755 /usr/local/bin/wangshun-entrypoint

EXPOSE 80 443
CMD ["/usr/local/bin/wangshun-entrypoint"]
