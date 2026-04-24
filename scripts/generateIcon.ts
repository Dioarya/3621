import sharp from "sharp";
import { join } from "node:path";
import { access, constants, mkdir } from "node:fs/promises";
import { tryCatch } from "./src/trycatch.ts";
import appRootPath from "app-root-path";
import type { PathLike } from "node:fs";

if (!import.meta.main) process.exit();

const rootDirectory = appRootPath.path;
const publicDirectory = join(rootDirectory, "public");
const iconFile = join(publicDirectory, "icon.svg");
const iconDirectory = join(publicDirectory, "icon");

{
  // Check for iconFile's existance
  const { data: _, error } = await tryCatch(access(iconFile, constants.X_OK));
  if (error != null) {
    console.error("public/icon.svg does not exist.");
    process.exit(1);
  }
}

{
  // Try to create public/icon directory
  const { data: _, error } = await tryCatch(
    mkdir(iconDirectory, { recursive: true }),
  );
  if (error != null) {
    console.error("could not create public/icon directory.");
    process.exit(2);
  }
}

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

const sizes = [16, 32, 48, 96, 128];
const image = sharp(iconFile);
const promises = [];
for (const size of sizes) {
  const outputFilename = `${size}.png`;
  const outputPath = join(iconDirectory, outputFilename);
  console.log(`Icon ${size}: Creating icon.`);
  let promise: Promise<any> = createSizedIcon(image.clone(), size, outputPath);
  promise = promise.then(
    () => {
      console.log(`Icon ${size}: Created public/icon/${outputFilename}`);
    },
    (reason) => {
      console.warn(
        `Icon ${size}: public/icon/${outputFilename} errored with reason: ${reason}`,
      );
    },
  );
  promises.push(promise);
}
await Promise.all(promises);
