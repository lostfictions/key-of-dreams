require("source-map-support").install();

import { createReadStream } from "fs";
import Masto from "masto";

import { makeImage } from "./make-image";

import {
  MASTODON_SERVER,
  MASTODON_TOKEN,
  MASTODON_SERVER2,
  MASTODON_TOKEN2
} from "./env";

async function doToot(): Promise<void> {
  const { filename, caption } = await makeImage();

  const tootOne = async (uri: string, accessToken: string) => {
    const masto = await Masto.login({
      uri,
      accessToken
    });

    const { id } = await masto.uploadMediaAttachment({
      file: createReadStream(filename),
      description: caption,
      focus: "0,1"
    });

    const { created_at: time, uri: tootUri } = await masto.createStatus({
      status: "",
      visibility: "public",
      media_ids: [id]
    });

    return { time, tootUri };
  };

  const toots = [tootOne(MASTODON_SERVER, MASTODON_TOKEN)];

  if (MASTODON_SERVER2.length > 0 && MASTODON_TOKEN2.length > 0) {
    toots.push(tootOne(MASTODON_SERVER2, MASTODON_TOKEN2));
  }

  const res = await Promise.all(toots);

  console.log(res.map(l => `${l.time} -> ${l.tootUri}`).join("\n"));
}

const argv = process.argv.slice(2);

if (argv.includes("local")) {
  console.log("Running locally!");
  makeImage().then(async ({ filename, caption }) => {
    console.log(`${caption}\nfile://${filename}\n`);
    process.exit(0);
  });
} else {
  doToot().then(() => process.exit(0));
}
