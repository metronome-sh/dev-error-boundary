import MagicString from "magic-string";
import { parse } from "@typescript-eslint/typescript-estree";
import { walk } from "./walk";

const isHandleErrorExport = (node: any) => {
  return (
    node.type === "ExportNamedDeclaration" &&
    node.declaration &&
    ((node.declaration.type === "FunctionDeclaration" &&
      node.declaration.id.name === "handleError") ||
      (node.declaration.type === "VariableDeclaration" &&
        node.declaration.declarations.length === 1 &&
        node.declaration.declarations[0].id.name === "handleError"))
  );
};

export function transformEntryServer({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const ast = parse(code, {
    jsx: true,
    useJSXTextNode: true,
    loc: true,
    range: true,
  });

  const magicString = new MagicString(code);

  const importStr = `import { withErrorBoundaryErrorHandler } from "@metronome-sh/dev-error-boundary/server";\n`;

  if (!code.includes(importStr)) {
    magicString.prepend(importStr);
  }

  let handleErrorFound = false;

  walk(ast, (node) => {
    if (!isHandleErrorExport(node)) return;

    handleErrorFound = true;

    if (node.declaration.type === "FunctionDeclaration") {
      const [start, end] = node.declaration.range;

      const declarationCode = code.substring(start, end).replace(/;$/g, "");

      const replacementCode = `const handleError = withErrorBoundaryErrorHandler(${declarationCode})`;

      magicString.overwrite(start, end, replacementCode);
    }

    if (node.declaration.type === "VariableDeclaration") {
      const [start, end] = node.declaration.range;

      const declarationCode = code
        .substring(start, end)
        .replace(/^.*handleError\s*=\s*/g, "")
        .replace(/;$/g, "");

      const replacementCode = `const handleError = withErrorBoundaryErrorHandler(${declarationCode})`;

      magicString.overwrite(start, end, replacementCode);
    }
  });

  if (!handleErrorFound) {
    magicString.append(
      `export const handleError = withErrorBoundaryErrorHandler();\n`
    );
  }

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  };
}
