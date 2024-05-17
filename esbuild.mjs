import { build } from "esbuild";

/**
 * @type {import('esbuild').BuildOptions}
 */
const commonConfig = {
  bundle: true,
  sourcemap: true,
  packages: "external",
};

export const reactConfig = {
  ...commonConfig,
  entryPoints: ["src/react/react.tsx"],
  format: "esm",
  outfile: "dist/react.js",
  platform: "browser",
};

export const viteConfig = {
  ...commonConfig,
  entryPoints: ["src/vite/vite.ts"],
  format: "esm",
  outfile: "dist/vite.js",
  platform: "node",
};

export const serverConfig = {
  ...commonConfig,
  entryPoints: ["src/server/server.ts"],
  format: "esm",
  outfile: "dist/server.js",
  platform: "node",
};

(async () => {
  await Promise.all([
    build(reactConfig),
    build(viteConfig),
    build(serverConfig),
  ]);
})();
