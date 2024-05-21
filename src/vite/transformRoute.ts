import MagicString from "magic-string";
import { parse } from "@typescript-eslint/typescript-estree";
import { walk } from "./walk";
import { isNamedExport } from "./isNamedExport";

export function transformRoute({
  code,
  id,
  appDirectory,
}: {
  code: string;
  id: string;
  appDirectory: string;
}) {
  const ast = parse(code, {
    jsx: true,
    useJSXTextNode: true,
    loc: true,
    range: true,
  });

  const magicString = new MagicString(code, { filename: id });

  // prettier-ignore
  const importStr = 'import { withErrorBoundary, withErrorBoundaryLinks } from "@metronome-sh/dev-error-boundary/react";\n';
  // prettier-ignore
  const stylesStr = 'import devErrorBoundaryStyles from "@metronome-sh/dev-error-boundary/styles?url";\n';

  const appDirectoryStr = JSON.stringify(appDirectory);

  if (!code.includes(importStr)) magicString.prepend(importStr);
  if (!code.includes(stylesStr)) magicString.prepend(stylesStr);

  let errorBoundaryFound = false;
  let linksExportFound = false;

  walk(ast, (node) => {
    if (isNamedExport(node, "links")) {
      linksExportFound = true;

      const [start, end] = node.declaration.range;

      if (node.declaration.type === "FunctionDeclaration") {
        const declarationCode = code.substring(start, end).replace(/;$/g, "");

        const replacementCode = `const links = withErrorBoundaryLinks(devErrorBoundaryStyles, ${declarationCode})`;

        magicString.overwrite(start, end, replacementCode);

        return;
      }

      if (node.declaration.type === "VariableDeclaration") {
        const declarationCode = code
          .substring(start, end)
          .replace(/^.*links\s*(?::[^=]+)?=/g, "")
          .replace(/;$/g, "");

        const replacementCode = `const links = withErrorBoundaryLinks(devErrorBoundaryStyles, ${declarationCode})`;

        magicString.overwrite(start, end, replacementCode);
        return;
      }

      throw new Error(
        "[dev-error-boundary] Unhandled links export type:",
        node.declaration.type
      );
    }

    if (isNamedExport(node, "ErrorBoundary")) {
      errorBoundaryFound = true;

      const [start, end] = node.declaration.range;

      if (node.declaration.type === "FunctionDeclaration") {
        const declarationCode = code.substring(start, end).replace(/;$/g, "");

        const replacementCode = `const ErrorBoundary = withErrorBoundary(${appDirectoryStr}, ${declarationCode})`;

        magicString.overwrite(start, end, replacementCode);

        return;
      }

      if (node.declaration.type === "VariableDeclaration") {
        const declarationCode = code
          .substring(start, end)
          .replace(/^.*ErrorBoundary\s*=\s*/g, "")
          .replace(/;$/g, "");

        const replacementCode = `const ErrorBoundary = withErrorBoundary(${appDirectoryStr}, ${declarationCode})`;

        magicString.overwrite(start, end, replacementCode);
        return;
      }

      throw new Error(
        "[dev-error-boundary] Unhandled ErrorBoundary export type:",
        node.declaration.type
      );
    }
  });

  // prettier-ignore
  if (!errorBoundaryFound) magicString.append(`\nexport const ErrorBoundary = withErrorBoundary(${appDirectoryStr});\n`)

  // prettier-ignore
  if (!linksExportFound) magicString.append(`\nexport const links = () => [{ rel: "stylesheet", href: devErrorBoundaryStyles }];\n`);

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  };
}
