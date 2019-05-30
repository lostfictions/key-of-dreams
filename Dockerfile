FROM node:12.1

MAINTAINER s

WORKDIR /code

# https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container
RUN apt-get update && apt-get -y install -qq cron && apt-get clean
COPY cronrule /etc/cron.d/mastobot
RUN chmod +x /etc/cron.d/mastobot && crontab /etc/cron.d/mastobot

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

ENV NODE_ENV=production
ENV DEBUG=*
ENTRYPOINT ["sh", "run.sh"]
