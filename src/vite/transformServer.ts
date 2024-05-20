import MagicString from "magic-string";
import { parse } from "@typescript-eslint/typescript-estree";
import { walk } from "./walk";

export const transformServer = ({
  code,
  id,
  onRoutes,
}: {
  code: string;
  id: string;
  onRoutes: (routePaths: string[]) => void;
}) => {
  const ast = parse(code, {
    jsx: true,
    useJSXTextNode: true,
    loc: true,
    range: true,
  });

  const magicString = new MagicString(code, { filename: id });

  magicString.prepend(
    'import { registerDevErrorBoundary } from "@metronome-sh/dev-error-boundary/server";\n'
  );

  let routesObject: any = null;
  const importMap: { [key: string]: string } = {};

  walk(ast, (node) => {
    // Get the import map
    if (node.type === "ImportDeclaration") {
      const source = node.source.value;
      const specifier = node.specifiers[0].local.name;
      importMap[specifier] = source;
    }

    // Get the routes and add it to the routesObject
    if (
      node.type === "VariableDeclarator" &&
      node.id.name === "routes" &&
      node.init.type === "ObjectExpression"
    ) {
      routesObject = node.init;
    }

    // Find the `const routes` and wrap it
    if (node.type === "VariableDeclaration" && node.declarations.length > 0) {
      node.declarations.forEach((declaration: any) => {
        if (
          declaration.id &&
          declaration.id.name === "routes" &&
          declaration.init
        ) {
          const [start, end] = declaration.init.range;
          magicString.overwrite(
            start,
            end,
            `registerDevErrorBoundary(${code.substring(start, end)}, {})`
          );
        }
      });
    }
  });

  // Get the routes from the modules declaration
  const routePaths: string[] = [];

  if (routesObject) {
    routesObject.properties.forEach((prop: any) => {
      const moduleProperty = prop.value.properties.find(
        (p: any) => p.key.name === "module"
      );

      if (moduleProperty) {
        const moduleName = moduleProperty.value.name;
        const filePath = importMap[moduleName];
        if (filePath) {
          routePaths.push(filePath);
        }
      }
    });
  }

  onRoutes(routePaths);

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
