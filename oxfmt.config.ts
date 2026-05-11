import { defineConfig } from "oxfmt";

export default defineConfig({
  endOfLine: "lf",
  sortImports: {
    groups: [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown",
    ],
  },
  ignorePatterns: ["CHANGELOG.md", "CREDITS.md", "README.md"],
});
