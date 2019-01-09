FROM node:11 AS builder

ADD . /app/
WORKDIR /app
RUN yarn install
RUN yarn build

FROM nginx:1.14-alpine
COPY --from=builder /app/build/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
