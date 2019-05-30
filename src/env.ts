import path from "path";
import * as envalid from "envalid";

export const {
  RESOURCE_DIR,
  MASTODON_SERVER,
  MASTODON_TOKEN
} = envalid.cleanEnv(
  process.env,
  {
    // The resource dir is currently checked in to the repo.
    RESOURCE_DIR: envalid.str({
      default: path.join(__dirname, "..", "resources")
    }),
    MASTODON_SERVER: envalid.url({ default: "https://botsin.space/" }),
    MASTODON_TOKEN: envalid.str()
  },
  { strict: true }
);
