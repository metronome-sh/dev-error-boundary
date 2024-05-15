import { ErrorResponse as RemixErrorResponse } from "@remix-run/server-runtime";
import { FunctionComponent } from "react";

export interface ErrorResponseProps {
  error: RemixErrorResponse;
}

export const ErrorResponse: FunctionComponent<ErrorResponseProps> = ({
  error,
}) => {
  return (
    <div>
      <div className="mt-w-full">
        <div className="mt-text-red-500 mt-text-sm mt-p-4 mt-w-full">
          <code>
            <pre>{error.data}</pre>
          </code>
        </div>
      </div>
    </div>
  );
};
