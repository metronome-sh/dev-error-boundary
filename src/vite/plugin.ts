import { PluginOption } from "vite";
import { transformRoute } from "./transformRoute";
import { transformServer } from "./transformServer";
import { transformEntryServer } from "./transformEntryServer";

let remixPluginContext: any;

let routes: string[] = [];

export const devErrorBoundary: (config?: never) => PluginOption = () => {
  function isRouteFile(id: string) {
    const isRoute = routes.some((routeFile: string) => id.endsWith(routeFile));
    return isRoute;
  }

  function isNotResourceRoute(code: string) {
    return code.includes("export default");
  }

  return {
    name: "@metronome-sh/dev-error-boundary",
    apply: "serve",
    enforce: "pre",
    configResolved(resolvedConfig) {
      const { __remixPluginContext } = resolvedConfig as any;
      if (__remixPluginContext) remixPluginContext = __remixPluginContext;
    },
    transform(code, id) {
      if (id.match(/virtual:remix\/server-build/)) {
        return transformServer({
          code,
          id,
          onRoutes: (routePaths) => (routes = routePaths),
        });
      }

      // Transform the entry.server file to wrap the handleError function
      if (id.match(/entry\.server\./)) {
        return transformEntryServer({ code, id });
      }

      if (
        (isRouteFile(id) && isNotResourceRoute(code)) ||
        id.match(/\/root\.[jt]sx$/)
      ) {
        const { appDirectory } = remixPluginContext.remixConfig;
        return transformRoute({ code, id, appDirectory });
      }
    },
  };
};
