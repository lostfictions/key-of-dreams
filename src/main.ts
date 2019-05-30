require("source-map-support").install();

import { createReadStream } from "fs";
import Masto from "masto";

import { makeImage } from "./make-image";

import { MASTODON_SERVER, MASTODON_TOKEN } from "./env";

async function doToot(): Promise<void> {
  const { filename, caption } = await makeImage();

  const masto = await Masto.login({
    uri: MASTODON_SERVER,
    accessToken: MASTODON_TOKEN
  });

  const { id } = await masto.uploadMediaAttachment({
    file: createReadStream(filename),
    description: caption
  });

  // FIXME: bad typings
  const status: any = await masto.createStatus({
    status: "",
    visibility: "public",
    media_ids: [id]
  });

  console.log(`${status.created_at} -> ${status.uri}`);
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
