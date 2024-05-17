import { Routes } from "../common/types";
import { createSourcesRouteModule } from "./createSourcesRouteModule";
import { ERROR_BOUNDARY_ROUTE_PATH } from "../common/constants";

export function registerDevErrorBoundary(routes: Routes, config: any): Routes {
  routes[ERROR_BOUNDARY_ROUTE_PATH] = {
    id: ERROR_BOUNDARY_ROUTE_PATH,
    parentId: undefined,
    path: ERROR_BOUNDARY_ROUTE_PATH,
    index: false,
    caseSensitive: undefined,
    module: createSourcesRouteModule(),
  };

  return routes;
}
