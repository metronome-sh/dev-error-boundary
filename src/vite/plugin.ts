import { PluginOption } from "vite";
import { transformRoute } from "./transformRoute";
import { transformServer } from "./transformServer";

let remixPluginContext: any;

export const devErrorBoundary: (config?: never) => PluginOption = () => {
  function isRouteFile(id: string) {
    if (!remixPluginContext) return false;

    const { routes } = remixPluginContext.remixConfig;

    const routeFiles = Object.values(routes).map((route: any) => route.file);

    return routeFiles.some((routeFile: string) => id.endsWith(routeFile));
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
      if ((isRouteFile(id) && isNotResourceRoute(code)) || id.match(/\/root\.[jt]sx$/)) {
        const { appDirectory } = remixPluginContext.remixConfig;
        return transformRoute({ code, id, appDirectory });
      }

      if (id.match(/virtual:remix\/server-build/)) {
        return transformServer(code, id);
      }
    },
  };
};
