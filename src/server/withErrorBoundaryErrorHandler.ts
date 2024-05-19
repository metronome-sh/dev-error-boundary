import {
  ActionFunctionArgs,
  ErrorResponse,
  LoaderFunctionArgs,
} from "@remix-run/server-runtime";

export function withErrorBoundaryErrorHandler(
  errorHandle?: (
    error: Error | ErrorResponse,
    args: LoaderFunctionArgs | ActionFunctionArgs
  ) => void
) {
  return async (
    error: Error | ErrorResponse,
    { request, params, context }: LoaderFunctionArgs | ActionFunctionArgs
  ) => {
    errorHandle?.(error, { request, params, context });

    const requestSnapshot = {
      method: request.method,
      url: request.url,
      headers: [...request.headers.entries()],
      body: request.body,
    };

    if ("data" in error) {
      (error as ErrorResponse).data = JSON.stringify({
        __original: error.data,
        __dev_error_boundary: {
          message: error.data,
          request: requestSnapshot,
          response: {
            status: error.status,
            statusText: error.statusText,
          },
          params,
          context,
        },
      });
    } else {
      (error as Error).message = JSON.stringify({
        __original: error.message,
        __dev_error_boundary: {
          message: error.message,
          request: requestSnapshot,
          params,
          context,
        },
      });
    }
  };
}
