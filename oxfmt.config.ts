import { defineConfig } from "oxfmt";

export default defineConfig({
  endOfLine: "lf",
  sortTailwindcss: {
    stylesheet: "./src/assets/tailwind.css",
    functions: ["cn", "clsx"],
  },
});
