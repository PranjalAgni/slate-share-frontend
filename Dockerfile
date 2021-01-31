FROM node:alpine
WORKDIR /usr/src/app
RUN npm i -g serve
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["yarn", "run", "prod"]