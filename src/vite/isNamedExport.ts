export const isNamedExport = (node: any, name: string) => {
  return Boolean(
    node.type === "ExportNamedDeclaration" &&
      node.declaration &&
      ((node.declaration.type === "FunctionDeclaration" &&
        node.declaration.id.name === name) ||
        (node.declaration.type === "VariableDeclaration" &&
          node.declaration.declarations.length === 1 &&
          node.declaration.declarations[0].id.name === name))
  );
};
