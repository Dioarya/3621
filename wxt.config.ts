import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "wxt";

import icong from "./scripts/vitePlugins/icong.ts";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  suppressWarnings: {
    firefoxDataCollection: true,
  },

  manifestVersion: 3,
  manifest: {
    permissions: ["storage", "webNavigation"],
  },

  vite: () => ({
    plugins: [tailwindcss(), icong()],
  }),

  webExt: {
    binaries: {
      firefox: "firefoxdeveloperedition", // Use Firefox Developer Edition instead of regular Firefox
    },

    // On Windows, the path must be absolute and exists
    chromiumProfile: resolve(".wxt/chrome-data"),
    keepProfileChanges: true,

    startUrls: ["https://e621.net/posts/5239172", "about:blank"],
  },

  imports: false,

  srcDir: "src",
});
