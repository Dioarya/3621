/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "popup-no-background",
      comment: "Popup must not import background code",
      severity: "error",
      from: { path: "src/entrypoints/popup" },
      to: { path: "src/entrypoints/background" },
    },
    {
      name: "popup-no-content",
      comment: "Popup must not import content code",
      severity: "error",
      from: { path: "src/entrypoints/popup" },
      to: { path: "src/entrypoints/content" },
    },
    {
      name: "background-no-popup",
      comment: "Background must not import popup code",
      severity: "error",
      from: { path: "src/entrypoints/background" },
      to: { path: "src/entrypoints/popup" },
    },
    {
      name: "background-no-content",
      comment: "Background must not import content code",
      severity: "error",
      from: { path: "src/entrypoints/background" },
      to: { path: "src/entrypoints/content" },
    },
    {
      name: "content-no-popup",
      comment: "Content must not import popup code",
      severity: "error",
      from: { path: "src/entrypoints/content" },
      to: { path: "src/entrypoints/popup" },
    },
    {
      name: "content-no-background",
      comment: "Content must not import background code",
      severity: "error",
      from: { path: "src/entrypoints/content" },
      to: { path: "src/entrypoints/background" },
    },
    {
      name: "nonpopup-no-ui",
      comment: "UI code (views/, components/) is only for the popup",
      severity: "error",
      from: {
        pathNot: ["src/entrypoints/popup", "src/components/", "src/views/"],
      },
      to: { path: ["src/views/", "src/components/"] },
    },
  ],

  options: {
    tsConfig: {
      fileName: "tsconfig.json",
    },
    tsPreCompilationDeps: true,
    exclude: {
      path: ["node_modules", "\\.wxt"],
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "default"],
      mainFields: ["module", "main"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  },
};
