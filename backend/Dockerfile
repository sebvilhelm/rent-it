FROM node:10

WORKDIR /usr/src/app

RUN apt-get update && apt-get install yarn

COPY package.json ./
COPY yarn.lock ./

RUN yarn && \
  yarn run build && \
  yarn run prune && \
  yarn cache clean
CMD [ "npm", "start" ]
EXPOSE 8080