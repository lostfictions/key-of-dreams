FROM node:12.1
MAINTAINER s

WORKDIR /code

# https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container
RUN apt-get -mqq update && apt-get -ymqq install cron && apt-get clean

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

ENV NODE_ENV=production
ENV DEBUG=*
ENTRYPOINT ["bash", "run.sh", "yarn", "start"]
