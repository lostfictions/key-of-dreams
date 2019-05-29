import { tmpdir } from "os";
import path from "path";
import { readdirSync, createWriteStream } from "fs";
import { createCanvas, loadImage, registerFont } from "canvas";
import { cleanEnv, str } from "envalid";

const FONT_FILENAME = "popsies.ttf";
const FONT_STYLE = "popsies";
const X = 2;
const Y = 2;

const tmp = tmpdir();

function pluck<T>(arr: T[]): T {
  const i = Math.floor(Math.random() * arr.length);
  return arr.splice(i, 1)[0];
}

const { RESOURCE_DIR } = cleanEnv(
  process.env,
  {
    RESOURCE_DIR: str({ devDefault: path.join(__dirname, "..", "resources") })
  },
  { strict: true }
);

registerFont(path.join(RESOURCE_DIR, FONT_FILENAME), { family: FONT_STYLE });

const nouns: string[] = require(path.join(RESOURCE_DIR, "nouns.json")).nouns;

const imagePaths = readdirSync(path.join(RESOURCE_DIR, "emoji")).map(f =>
  path.join(RESOURCE_DIR, "emoji", f)
);

const canvas = createCanvas(400, 600);
const ctx = canvas.getContext("2d");

const imageBoxWidth = canvas.width / X;
const imageBoxHeight = canvas.height / Y;

async function makeImage() {
  const clonedPaths = [...imagePaths];
  const clonedNouns = [...nouns];

  const images = await Promise.all(
    [...Array(X * Y)].map(() => loadImage(pluck(clonedPaths)))
  );

  ctx.fillStyle = "#040406";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = [...Array(X * Y)].map(() => `the ${pluck(clonedNouns)}`);

  // shrink the font size if we're too wide.
  // we add a few characters of padding to try to compensate for node-canvas'
  // buggy discrepancies between fillText and strokeText.
  // note that shrinking the text may not be necessary in the first place with a
  // real canvas -- the latter has a "maxWidth" parameter when drawing text, but
  // it's broken in node-canvas.
  let fontSize = 30;
  do {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${FONT_STYLE}`;
    if (fontSize < 1) throw new Error("node-canvas will never be satisfied");
  } while (text.some(t => ctx.measureText(t + "xx").width > imageBoxWidth));

  let iter = 0;
  for (let j = 0; j < Y; j++) {
    for (let i = 0; i < X; i++) {
      ctx.drawImage(
        images[iter],
        i * imageBoxWidth + 20,
        j * imageBoxHeight + 50,
        160,
        160
      );

      ctx.fillText(
        text[iter],
        i * imageBoxWidth + 100,
        j * imageBoxHeight + 255
      );

      iter++;
    }
  }

  ctx.restore();

  const filename = path.join(
    tmp,
    `key-of-dreams--${new Date().toISOString().replace(/:/g, "-")}.png`
  );

  const out = createWriteStream(filename);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  await new Promise((res, rej) => {
    out.on("finish", () => res());
    out.on("error", e => rej(e));
  });

  console.log("done:", `file://${filename}`);
}

makeImage();
// setInterval(makeImage, 3000);
