import { LinksFunction } from "@remix-run/server-runtime";

export function withErrorBoundaryLinks(
  stylesSrc: string,
  links: LinksFunction
): LinksFunction {
  return (...args: Parameters<LinksFunction>) => {
    return [...links(...args), { rel: "stylesheet", href: stylesSrc }];
  };
}
