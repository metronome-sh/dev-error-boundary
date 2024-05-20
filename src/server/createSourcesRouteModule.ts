import { json, type ActionFunction } from "@remix-run/server-runtime";
import path from "node:path";
import fs from "node:fs";
import * as stackTraceParser from "stacktrace-parser";
import { codeToHtml } from "shiki";

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
      return json({ source: "unable-to-render-source" });
    }

    const code = fs.readFileSync(path.join(file), "utf-8");

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
