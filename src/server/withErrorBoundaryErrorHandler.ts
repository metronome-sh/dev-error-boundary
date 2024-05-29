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
  return (
    error: Error | ErrorResponse,
    { request, params, context }: LoaderFunctionArgs | ActionFunctionArgs
  ) => {
    errorHandle?.(error, { request, params, context });

    globalThis.__DEV_ERROR_BOUNDARY_LAST_ERROR = {
      error,
      request,
      params,
      context,
    };
  };
}
