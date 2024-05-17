import { context } from "esbuild";
import { reactConfig, viteConfig, serverConfig } from "./esbuild.mjs";

const reactContext = await context(reactConfig);
const viteContext = await context(viteConfig);
const serverContext = await context(serverConfig);

await Promise.all([
  reactContext.rebuild(),
  viteContext.rebuild(),
  serverContext.rebuild(),
]);

await Promise.all([
  viteContext.watch(),
  reactContext.watch(),
  serverContext.watch(),
]);

console.log(" 👀 Watching for changes...");
