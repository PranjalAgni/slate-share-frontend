FROM node:alpine as builder
WORKDIR /usr/src/app
COPY package.json .
RUN yarn install --silent
COPY . .
RUN yarn build

FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
