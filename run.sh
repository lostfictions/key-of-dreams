#!/bin/bash
set -Eeuo pipefail

# every four hours, on the hour
DEFAULT_CRON_RULE='0 */4 * * *'

if [[ -z "${CRON_RULE-}" ]]; then
    echo "CRON_RULE not set in environment, using default rule ($DEFAULT_CRON_RULE)"
fi

# the spooky stuff at the end is to convince cron to redirect stdout/stderr even
# in a docker container: https://stackoverflow.com/a/41409061
echo "${CRON_RULE-$DEFAULT_CRON_RULE} yarn --cwd $PWD start > /proc/\$(cat /var/run/crond.pid)/fd/1 2>&1" > /etc/cron.d/mastobot
# cron wants a newline at the end of a file, too.
printf "\n" >> /etc/cron.d/mastobot

chmod +x /etc/cron.d/mastobot
crontab /etc/cron.d/mastobot

# cron doesn't have access to our container environment variables by default, so
# we just dump them to /etc/environment, as suggested here:
# https://stackoverflow.com/a/41938139
# this may pose some security concerns somehow, caveat emptor, etc etc.
printenv >> /etc/environment

# finally, run cron in the foreground (-f). '-L 15', in debian, also turns on
# verbose logging: https://manpages.debian.org/stretch/cron/cron.8.en.html
cron -f -L 15
