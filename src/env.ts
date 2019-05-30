import path from "path";
import * as envalid from "envalid";

export const {
  RESOURCE_DIR,
  MASTODON_SERVER,
  MASTODON_TOKEN,
  CRON_RULE
} = envalid.cleanEnv(
  process.env,
  {
    // The resource dir is currently checked in to the repo, but that may change
    // in the future
    RESOURCE_DIR: envalid.str({
      devDefault: path.join(__dirname, "..", "resources")
    }),
    MASTODON_SERVER: envalid.url({ default: "https://botsin.space/" }),
    MASTODON_TOKEN: envalid.str(),
    CRON_RULE: envalid.str({ default: "30 3,7,11,15,19,23 * * *" })
  },
  { strict: true }
);
