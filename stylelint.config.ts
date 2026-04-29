import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
    "stylelint-config-tailwindcss",
  ],
  cache: true,

  rules: {
    "no-duplicate-selectors": [
      true,
      {
        disallowInList: false,
      },
    ],
  },

  overrides: [
    {
      files: ["**/global.css"],
      rules: {
        "no-duplicate-selectors": null,
      },
    },
  ],
} satisfies Config;
