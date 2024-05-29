import { Routes } from "../common/types";
import { createSourcesRouteModule } from "./createSourcesRouteModule";
import {
  ERROR_BOUNDARY_ROUTE_PATH_SOURCE,
  ERROR_BOUNDARY_ERROR_CONTEXT,
} from "../common/constants";
import { createLastErrorRouteModule } from "./createLastErrorRouteModule";

export function registerDevErrorBoundary(routes: Routes, config: any): Routes {
  routes[ERROR_BOUNDARY_ROUTE_PATH_SOURCE] = {
    id: ERROR_BOUNDARY_ROUTE_PATH_SOURCE,
    parentId: undefined,
    path: ERROR_BOUNDARY_ROUTE_PATH_SOURCE,
    index: false,
    caseSensitive: undefined,
    module: createSourcesRouteModule(),
  };

  routes[ERROR_BOUNDARY_ERROR_CONTEXT] = {
    id: ERROR_BOUNDARY_ERROR_CONTEXT,
    parentId: undefined,
    path: ERROR_BOUNDARY_ERROR_CONTEXT,
    index: false,
    caseSensitive: undefined,
    module: createLastErrorRouteModule(),
  };

  return routes;
}
