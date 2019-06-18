import path from "path";
import * as envalid from "envalid";

export const {
  RESOURCE_DIR,
  MASTODON_SERVER,
  MASTODON_TOKEN,
  MASTODON_SERVER2,
  MASTODON_TOKEN2
} = envalid.cleanEnv(
  process.env,
  {
    // The resource dir is currently checked in to the repo.
    RESOURCE_DIR: envalid.str({
      default: path.join(__dirname, "..", "resources")
    }),
    MASTODON_SERVER: envalid.url({ default: "https://botsin.space/" }),
    MASTODON_TOKEN: envalid.str(),
    // HACK: not sure how best to generalize server/token pairs in env vars, or
    // even whether this is generally desirable
    MASTODON_SERVER2: envalid.url({ default: "" }),
    MASTODON_TOKEN2: envalid.str({ default: "" })
  },
  { strict: true }
);
