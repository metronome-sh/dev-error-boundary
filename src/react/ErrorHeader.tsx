import { FunctionComponent } from "react";
import { DevErrorBoundaryError } from "./useDevBoundaryError";

interface ErrorHeaderProps {
  error: DevErrorBoundaryError;
}

export const ErrorHeader: FunctionComponent<ErrorHeaderProps> = ({ error }) => {
  return (
    <div className="px-5 py-3 mb-3 flex border-b border-gray-100 dark:border-gray-700">
      <div className="flex-grow">
        <div className="text-sm text-red-600 dark:text-red-400">
          <span className="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 inline"
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
        <div className="text-lg font-semibold dark:text-gray-50 max-h-28 overflow-y-scroll">
          {error.isErrorResponse
            ? `${error.response.status} ${error.response.statusText}`
            : error.message}
        </div>
      </div>
    </div>
  );
};
