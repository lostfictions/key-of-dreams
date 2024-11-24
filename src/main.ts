import { join } from "path";
import { tmpdir } from "os";
import { writeFile } from "fs/promises";
import { twoot } from "twoot";

import { makeImage } from "./make-image";

import {
  BSKY_PASSWORD,
  BSKY_USERNAME,
  MASTODON_SERVER,
  MASTODON_TOKEN,
} from "./env";

async function doToot(): Promise<void> {
  const { canvas, caption } = await makeImage();

  const buffer = canvas.toBuffer("image/png");

  const results = await twoot(
    {
      status: "",
      media: [{ buffer, caption }],
    },
    [
      {
        type: "mastodon",
        server: MASTODON_SERVER,
        token: MASTODON_TOKEN,
      },
      {
        type: "bsky",
        username: BSKY_USERNAME,
        password: BSKY_PASSWORD,
      },
    ],
  );

  for (const res of results) {
    switch (res.type) {
      case "mastodon":
        console.log(`tooted at ${res.status.url}`);
        break;
      case "bsky":
        console.log(`skeeted at ${res.status.uri}`);
        break;
      case "error":
        console.error(`error while tooting:\n${res.message}`);
        break;
      default:
        console.error(`unexpected value:\n${JSON.stringify(res)}`);
    }
  }
}

const argv = process.argv.slice(2);

if (argv.includes("local")) {
  console.log("Running locally!");
  (async () => {
    const { canvas, caption } = await makeImage();
    const buffer = canvas.toBuffer("image/png");

    const filename = join(
      tmpdir(),
      `key-of-dreams--${new Date().toISOString().replaceAll(/:|\./g, "-")}.png`,
    );

    await writeFile(filename, buffer);

    console.log(`${caption}\nfile://${filename}\n`);
  })().catch((e) => {
    throw e;
  });
} else {
  doToot().catch((e) => {
    throw e;
  });
}
