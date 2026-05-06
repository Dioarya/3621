// HMR Generation of icon, watches /icon.svg and generates icon inside /icon/*.png
import type { Plugin, ResolvedConfig } from "vite";

import { join } from "node:path";

import generateIcon from "../generateIcon";

let firstRan = false;

export default function iconsPlugin() {
  let config: ResolvedConfig;

  return {
    name: "generate-icons",
    configResolved(resolved) {
      config = resolved;
    },
    async buildStart() {
      if (firstRan) return;
      firstRan = true;
      await generateIcon();
    },
    configureServer(server) {
      const iconFile = join(config.publicDir, "icon.svg");
      server.watcher.add(iconFile);
      server.watcher.on("change", async (file) => {
        if (file.endsWith(".svg")) {
          await generateIcon();
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  } as Plugin;
}
