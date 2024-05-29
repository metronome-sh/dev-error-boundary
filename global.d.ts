import { ErrorResponse } from "@remix-run/server-runtime";

declare global {
  var __DEV_ERROR_BOUNDARY_LAST_ERROR:
    | {
        error: Error | ErrorResponse;
        request: Request;
        params: any;
        context: any;
      }
    | undefined;
}
