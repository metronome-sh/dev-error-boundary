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

  const importStr = 'import { withErrorBoundary } from "@metronome-sh/dev-error-boundary/react";\n';

  const stylesStr = 'import "@metronome-sh/dev-error-boundary/styles";';

  const appDirectoryStr = JSON.stringify(appDirectory);

  if (id.match(/\/root\.[jt]sx$/) && !code.includes(stylesStr)) {
    magicString.prepend(stylesStr);
  }

  if (!code.includes(importStr)) magicString.prepend(importStr);

  let errorBoundaryFound = false;

  walk(ast, (node) => {
    if (isErrorBoundaryExport(node)) {
      const [start, end] = node.declaration.range;

      let declarationCode = code.substring(start, end);

      // Modify the declaration based on its type
      if (node.declaration.type === "FunctionDeclaration") {
        // Convert function declaration to constant declaration with function expression
        declarationCode = `const ${
          node.declaration.id.name
        } = withErrorBoundary(${appDirectoryStr}, function ${
          node.declaration.id.name
        }() ${declarationCode.substring(declarationCode.indexOf("{"))});\n`;
      } else if (node.declaration.declarations[0].init.type === "ArrowFunctionExpression") {
        // Wrap arrow function with withErrorBoundary
        declarationCode = `const ${
          node.declaration.declarations[0].id.name
        } = withErrorBoundary(${appDirectoryStr}, ${declarationCode
          .substring(declarationCode.indexOf("=") + 1)
          // Remove the last ";"
          .replace(/;$/, "")
          .trim()});`;
      }

      magicString.overwrite(start, end, declarationCode);

      errorBoundaryFound = true;
    }
  });

  if (!errorBoundaryFound) {
    magicString.append(`\nexport const ErrorBoundary = withErrorBoundary(${appDirectoryStr});\n`);
  }

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
    id,
  };
}
