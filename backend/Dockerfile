FROM node:10

WORKDIR /usr/src/app

# Install yarn
RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get -y install yarn

COPY package.json ./
COPY yarn.lock ./
COPY . .

RUN yarn install --frozen-lockfile --no-cache --production

CMD [ "yarn", "start" ]
EXPOSE 4000