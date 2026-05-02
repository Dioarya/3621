import { access, constants, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { tryCatch } from "./src/trycatch.ts";

const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = join(rootDirectory, "public");
const iconFile = join(publicDirectory, "icon.svg");
const iconDirectory = join(publicDirectory, "icon");

const silent = !import.meta.main;

function createSizedIcon(
  cloned_image: sharp.Sharp,
  size: number,
  outputPath: string,
): Promise<sharp.OutputInfo> {
  return new Promise((resolve) =>
    resolve(
      cloned_image
        .resize({
          width: size,
          height: size,
          position: "centre",
          kernel: "mitchell",
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath),
    ),
  );
}

async function script() {
  {
    const { data: _, error } = await tryCatch(access(iconFile, constants.X_OK));
    if (error != null) {
      throw new Error("public/icon.svg does not exist.");
    }
  }

  {
    const { data: _, error } = await tryCatch(mkdir(iconDirectory, { recursive: true }));
    if (error != null) {
      throw new Error("could not create public/icon directory.");
    }
  }

  const sizes = [16, 32, 48, 96, 128];
  const image = sharp(iconFile);
  const promises = [];
  for (const size of sizes) {
    const outputFilename = `${size}.png`;
    const outputPath = join(iconDirectory, outputFilename);
    if (!silent) console.log(`Icon ${size}: Creating icon.`);
    let promise: Promise<any> = createSizedIcon(image.clone(), size, outputPath);

    if (!silent)
      promise = promise.then(
        () => console.log(`Icon ${size}: Created public/icon/${outputFilename}`),
        (reason) =>
          console.warn(
            `Icon ${size}: public/icon/${outputFilename} errored with reason: ${reason}`,
          ),
      );

    promises.push(promise);
  }
  await Promise.all(promises);
}

export default async function generateIcon() {
  return await script();
}

if (import.meta.main) {
  await script().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
