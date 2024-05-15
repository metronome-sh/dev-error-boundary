import { context } from "esbuild";
import { reactConfig, viteConfig } from "./esbuild.mjs";

const reactContext = await context(reactConfig);
const viteContext = await context(viteConfig);

await Promise.all([reactContext.rebuild(), viteContext.rebuild()]);

await Promise.all([viteContext.watch(), reactContext.watch()]);

console.log(" 👀 Watching for changes...");
