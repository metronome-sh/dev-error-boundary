import * as stackTraceParser from "stacktrace-parser";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { ERROR_BOUNDARY_ERROR_CONTEXT } from "../common/constants";
import { simpleHash } from "../common/simpleHash";

export interface DevErrorBoundaryErrorBase {
  message: string;
  request: {
    method: string;
    url: string;
    headers: [string, string][];
    body: string;
  } | null;
  context: string | null;
  params: Record<string, string> | null;
  stack: stackTraceParser.StackFrame[];
}

export type DevErrorBoudaryErrorResponse = DevErrorBoundaryErrorBase & {
  isErrorResponse: true;
  response: {
    status: number;
    statusText: string;
  };
};

export type DevErrorBoundaryRegularError = DevErrorBoundaryErrorBase & {
  isErrorResponse: false;
};

export type DevErrorBoundaryError =
  | DevErrorBoudaryErrorResponse
  | DevErrorBoundaryRegularError;

// This hook should be used only at top level of the Error Boundary as it replaces the error object
// Once it gets parsed, it should be passed down to the children components as props
export function useDevBoundaryError(): DevErrorBoundaryError | null {
  const error = useRouteError();
  const [context, setContext] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    const hash = isRouteErrorResponse(error)
      ? simpleHash(error.data + error.status + error.statusText)
      : simpleHash((error as Error).message + (error as Error).stack);

    fetch(ERROR_BOUNDARY_ERROR_CONTEXT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    })
      .then((response) => response.json())
      .then((data) => setContext(data.context));
  }, [error]);

  return useMemo(() => {
    // Loading context
    if (context === undefined) return null;

    if (isRouteErrorResponse(error)) {
      const responseError: DevErrorBoudaryErrorResponse = {
        message: error.data,
        request: context?.request ?? null,
        context: context?.context ?? null,
        params: context?.params ?? null,
        isErrorResponse: true,
        stack: [],
        response: { status: error.status, statusText: error.statusText },
      };

      return responseError;
    } else {
      const regularError: DevErrorBoundaryRegularError = {
        message: (error as Error).message,
        request: context?.request ?? null,
        context: context?.context ?? null,
        params: context?.params ?? null,
        isErrorResponse: false,
        stack: stackTraceParser.parse((error as Error).stack || ""),
      };

      return regularError;
    }
  }, [context]);
}
