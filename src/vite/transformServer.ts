import MagicString from "magic-string";
import { parse } from "@typescript-eslint/typescript-estree";
import { walk } from "./walk";

export const transformServer = (code: string, id: string) => {
  const ast = parse(code, {
    jsx: true,
    useJSXTextNode: true,
    loc: true,
    range: true,
  });

  const magicString = new MagicString(code, { filename: id });

  magicString.prepend(
    'import { registerErrorBoundary } from "@metronome-sh/dev-error-boundary";\n'
  );

  walk(ast, (node) => {
    // Find the `const routes` and wrap it
    if (node.type === "VariableDeclaration" && node.declarations.length > 0) {
      node.declarations.forEach((declaration: any) => {
        if (declaration.id && declaration.id.name === "routes" && declaration.init) {
          const [start, end] = declaration.init.range;
          magicString.overwrite(
            start,
            end,
            `registerErrorBoundary(${code.substring(start, end)}, {})`
          );
        }
      });
    }
  });

  const serverCode = magicString.toString();

  return {
    code: serverCode,
    map: new MagicString(serverCode).generateMap({
      includeContent: true,
      source: id,
      file: id,
    }),
  };
};
