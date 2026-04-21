import { resolve } from "node:path";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  suppressWarnings: {
    firefoxDataCollection: true,
  },

  webExt: {
    binaries: {
      firefox: "firefoxdeveloperedition", // Use Firefox Developer Edition instead of regular Firefox
    },

    // On Windows, the path must be absolute and exists
    chromiumProfile: resolve(".wxt/chrome-data"),
    keepProfileChanges: true,
  },

  srcDir: "src",
});
