import { access, constants, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

import { tryCatch } from "./src/trycatch.ts";

const rootDirectory = process.cwd();
const publicDirectory = join(rootDirectory, "public");
const iconFile = join(publicDirectory, "icon.svg");
const iconDirectory = join(publicDirectory, "icon");

const silent = !import.meta.main;

function createSizedIcon(cloned_image: sharp.Sharp, size: number, outputPath: string) {
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
    const { data: _, error } = await tryCatch(access(iconFile, constants.R_OK));
    if (error != null) {
      console.error(`${iconFile} does not exist.`);
      throw error;
    }
  }

  {
    const { data: _, error } = await tryCatch(mkdir(iconDirectory, { recursive: true }));
    if (error != null) {
      console.error(`could not create ${iconDirectory} directory.`);
      throw error;
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
        () => console.log(`Icon ${size}: Created ${outputPath}`),
        (reason) => console.warn(`Icon ${size}: ${outputPath} errored with reason: ${reason}`),
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
