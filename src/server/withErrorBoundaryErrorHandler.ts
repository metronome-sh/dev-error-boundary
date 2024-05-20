import {
  ActionFunctionArgs,
  ErrorResponse,
  LoaderFunctionArgs,
} from "@remix-run/server-runtime";

const replacer = (key: string, value: any) => {
  // Handle functions
  if (typeof value === "function") {
    return `[Function ${value.toString()}]`;
  }

  // Handle BigInts
  if (typeof value === "bigint") {
    return `[BigInt(${value.toString()})]`;
  }

  // Handle Maps
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  }

  // Handle Sets
  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value.values()),
    };
  }

  // Handle Dates
  if (value instanceof Date) {
    return `[Date(${value.toISOString()})]`;
  }

  // Handle RegExps
  if (value instanceof RegExp) {
    return `[RegExp(${value.toString()})]`;
  }

  // Handle Errors
  if (value instanceof Error) {
    return {
      dataType: "Error",
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  // Handle generic objects
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.constructor.name !== "Object"
  ) {
    return `[${value.constructor.name}]`;
  }

  return value;
};

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

    let serializedContext = "{}";

    try {
      serializedContext = JSON.stringify(context, replacer, 2);
    } catch (error) {
      serializedContext = JSON.stringify(context, null, 2);
    }

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
          context: serializedContext,
        },
      });
    } else {
      (error as Error).message = JSON.stringify({
        __original: error.message,
        __dev_error_boundary: {
          message: error.message,
          request: requestSnapshot,
          params,
          context: serializedContext,
        },
      });
    }
  };
}
