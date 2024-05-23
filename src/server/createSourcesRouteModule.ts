import { json, type ActionFunction } from "@remix-run/server-runtime";
import path from "node:path";
import fs from "node:fs";
import * as stackTraceParser from "stacktrace-parser";
import { codeToHtml } from "shiki";

const notAvailable =
  '<div class="text-center text-gray-400">Source not available</div>';

const unableToAccess =
  '<div class="text-center text-gray-400">Unable to access the source</div>';

export function createSourcesRouteModule() {
  const action: ActionFunction = async ({ request, context, params }) => {
    const { frame, appDirectory } = (await request.json()) as {
      frame: stackTraceParser.StackFrame;
      appDirectory: string;
    };

    if (!frame || !frame.file) {
      return json({ source: "no-source-found" });
    }

    let { file } = frame;

    if (file.startsWith("file://")) {
      return json({ source: notAvailable });
    }

    // if is a URL, get the path and append the appDirectory as it is relative to the app directory
    if (file.startsWith("http")) {
      const { pathname } = new URL(file);

      // If contains node_modules, it is a package, so we don't need to render the source
      if (pathname.includes("node_modules")) {
        return json({ source: notAvailable });
      }

      file = path.join(appDirectory, "..", new URL(file).pathname);
    }

    try {
      fs.accessSync(file);
    } catch (error) {
      return json({ source: unableToAccess });
    }

    const code = fs.readFileSync(file, "utf-8");

    const source = await codeToHtml(code, {
      lang: "tsx",
      theme: "light-plus",
      transformers: [
        {
          line(node, line) {
            if (line === frame.lineNumber) {
              this.addClassToHast(node, "error");
            }

            node.properties["data-line-number"] = line;
            node.properties["id"] = `error-line-${line}`;
          },
        },
      ],
    });

    return json({ source });
  };

  return { action, default: undefined };
}
