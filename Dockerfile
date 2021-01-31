FROM node:alpine as builder
WORKDIR /usr/src/app
RUN npm i -g serve
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 5000
CMD ["yarn", "run", "prod"]