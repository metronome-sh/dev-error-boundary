import MagicString from "magic-string";
import { parse } from "@typescript-eslint/typescript-estree";
import { walk } from "./walk";

const isErrorBoundaryExport = (node: any) => {
  return (
    node.type === "ExportNamedDeclaration" &&
    node.declaration &&
    ((node.declaration.type === "FunctionDeclaration" &&
      node.declaration.id.name === "ErrorBoundary") ||
      (node.declaration.type === "VariableDeclaration" &&
        node.declaration.declarations.length === 1 &&
        node.declaration.declarations[0].id.name === "ErrorBoundary"))
  );
};

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
  const importStr = 'import { withErrorBoundary } from "@metronome-sh/dev-error-boundary/react";\n';
  const stylesStr = 'import "@metronome-sh/dev-error-boundary/styles";\n';

  const appDirectoryStr = JSON.stringify(appDirectory);

  if (!code.includes(importStr)) magicString.prepend(importStr);

  const isRoot = id.match(/\/root\.[jt]sx$/);
  if (isRoot && !code.includes(stylesStr)) magicString.prepend(stylesStr);

  let errorBoundaryFound = false;

  walk(ast, (node) => {
    if (isErrorBoundaryExport(node)) {
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

  if (!errorBoundaryFound) {
    magicString.append(
      `\nexport const ErrorBoundary = withErrorBoundary(${appDirectoryStr});\n`
    );
  }

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  };
}
