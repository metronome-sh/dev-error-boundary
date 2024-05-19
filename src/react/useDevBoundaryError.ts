import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useMemo } from "react";

export interface DevErrorBoundaryErrorBase {
  message: string;
  request: {
    method: string;
    url: string;
    headers: [string, string][];
    body: string;
  };
  context: object;
  params: Record<string, string>;
}

export type DevErrorBoudaryErrorResponse = DevErrorBoundaryErrorBase & {
  stack: never;
  isErrorResponse: true;
  response: {
    status: number;
    statusText: string;
  };
};

export type DevErrorBoundaryRegularError = DevErrorBoundaryErrorBase & {
  stack: string;
  isErrorResponse: false;
};

export type DevErrorBoundaryError =
  | DevErrorBoudaryErrorResponse
  | DevErrorBoundaryRegularError;

// This hook should be used only at top level of the Error Boundary as it replaces the error object
// Once it gets parsed, it should be passed down to the children components as props
export function useDevBoundaryError(): DevErrorBoundaryError {
  const error = useRouteError();

  return useMemo(() => {
    try {
      if (isRouteErrorResponse(error)) {
        const { __dev_error_boundary = null } = JSON.parse(error.data) as {
          __dev_error_boundary?: DevErrorBoundaryError;
        };

        if (!__dev_error_boundary) {
          throw new Error("Dev error boundary error cannot be parsed.");
        }
        __dev_error_boundary.isErrorResponse = true;

        return __dev_error_boundary;
      } else if (error instanceof Error) {
        const { __dev_error_boundary = null } = JSON.parse(error.message) as {
          __dev_error_boundary?: DevErrorBoundaryError;
        };

        if (!__dev_error_boundary) {
          throw new Error("Dev error boundary error cannot be parsed.");
        }

        __dev_error_boundary.isErrorResponse = false;
        __dev_error_boundary.stack = error.stack || "";

        return __dev_error_boundary;
      }

      throw new Error("Error is not an instance of Error or ErrorResponse.");
    } catch (error) {
      return {
        message: `[@metronome-sh/dev-error-boundary] An error occurred while parsing the error: ${error}`,
        request: { method: "", url: "", headers: [], body: "" },
        context: {},
        params: {},
        stack: "",
        isErrorResponse: false,
      } as DevErrorBoundaryRegularError;
    }
  }, [error]);
}
