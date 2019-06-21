## key of dreams

a bot that generates emoji magrittes.

![key of dreams](https://i.imgur.com/ycuk8sD.png)

run with [docker](https://docs.docker.com/) for an easier time.
pass environment variables to the program if you want the bot to do stuff:

- `MASTODON_TOKEN`: a Mastodon user API token (required)
- `MASTODON_SERVER`: the instance to which API calls should be made (usually where the bot user lives.) (default: https://botsin.space/)
- `RESOURCE_DIR`: the directory in which to search for image data. (default: the images already checked in to the repo.)
- `CRON_RULE`: the interval between each post, in crontab format. (default: every four hours)


###### [more bots?](https://github.com/lostfictions?tab=repositories&q=botally)
