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
  },

  srcDir: "src",
});
