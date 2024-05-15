export const walk = (node: any, callback: (node: any, parent?: any) => void, parent?: any) => {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, callback, parent));
  } else if (node && typeof node === "object") {
    callback(node, parent);
    Object.keys(node).forEach((key) => {
      if (node[key] && typeof node[key] === "object") {
        walk(node[key], callback, node);
      }
    });
  }
};
