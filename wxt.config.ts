import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { defineConfig } from "wxt";

import icong from "./scripts/vitePlugins/icong.ts";

function slugify(str: string) {
  return str
    .replace(/[/\\:*?"<>|\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const gitVersion = process.env.CI
  ? slugify(process.env.GITHUB_REF_NAME ?? "unknown")
  : execSync("git describe --tags --always --dirty").toString().trim();

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  suppressWarnings: {
    firefoxDataCollection: true,
  },

  zip: {
    artifactTemplate: `{{name}}-${gitVersion}-{{browser}}.zip`,
    sourcesTemplate: `{{name}}-${gitVersion}-sources.zip`,
  },

  manifestVersion: 3,
  manifest: {
    permissions: ["storage", "webNavigation", "scripting"],
    host_permissions: ["*://e621.net/*"],
    browser_specific_settings: {
      gecko: {
        id: "e6hancer@e6hancer.com",
      },
    },
  },

  vite: () => ({
    plugins: [icong()],
    define: {
      __VERSION__: JSON.stringify(gitVersion),
    },
    build: {
      rolldownOptions: {
        experimental: {
          lazyBarrel: true,
        },
      },
    },
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
