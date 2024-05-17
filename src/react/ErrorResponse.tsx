import { ErrorResponse as RemixErrorResponse } from "@remix-run/server-runtime";
import { FunctionComponent } from "react";
import { DevErrorBoudaryErrorResponse } from "./useDevBoundaryError";

export interface ErrorResponseProps {
  error: DevErrorBoudaryErrorResponse;
}

export const ErrorResponse: FunctionComponent<ErrorResponseProps> = ({
  error,
}) => {
  return (
    <div>
      <div className="mt-w-full">
        <div className="mt-text-red-500 mt-text-sm mt-p-4 mt-w-full">
          <code>
            <pre>{error.message}</pre>
          </code>
        </div>
      </div>
    </div>
  );
};
