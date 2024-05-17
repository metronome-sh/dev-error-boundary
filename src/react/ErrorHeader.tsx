import { isRouteErrorResponse } from "@remix-run/react";
import { ErrorResponse } from "@remix-run/server-runtime";
import { FunctionComponent } from "react";
import { DevErrorBoundaryError } from "./useDevBoundaryError";

interface ErrorHeaderProps {
  error: DevErrorBoundaryError;
}

export const ErrorHeader: FunctionComponent<ErrorHeaderProps> = ({ error }) => {
  return (
    <div className="mt-p-5 mt-flex">
      <div className="mt-flex-grow">
        <div className="mt-text-sm mt-text-red-600">
          <span className="mt-mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="mt-w-4 mt-h-4 mt-inline"
            >
              <path
                fillRule="evenodd"
                d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Application Error
        </div>
        <div className="mt-text-lg mt-font-semibold">
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error.message}
        </div>
      </div>
    </div>
  );
};
