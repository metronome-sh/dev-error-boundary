import { FunctionComponent, useEffect, useState } from "react";
import * as stackTraceParser from "stacktrace-parser";
import { ERROR_BOUNDARY_ROUTE_PATH } from "../common/constants";
import { DevErrorBoundaryError } from "./useDevBoundaryError";
import { cn } from "./cn";
import { InfoIcon } from "./icon/InfoIcon";

export interface SourceProps {
  error: DevErrorBoundaryError;
  frame: stackTraceParser.StackFrame | null;
  appDirectory: string;
}

export const Source: FunctionComponent<SourceProps> = ({
  error,
  appDirectory,
  frame,
}) => {
  const [source, setSource] = useState(null);

  const cannotRenderSource =
    frame?.file === "<anonymous>" || frame?.file?.includes("node:");

  useEffect(() => {
    if (!frame || !frame.file || cannotRenderSource) return;

    setSource(null);

    fetch(ERROR_BOUNDARY_ROUTE_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frame, appDirectory }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSource(data.source);
      });
  }, [frame]);

  useEffect(() => {
    if (!frame) return;

    const errorLine = document.getElementById(`error-line-${frame.lineNumber}`);

    if (errorLine) {
      errorLine.scrollIntoView({ block: "center" });
    }
  }, [frame, source, cannotRenderSource]);

  if (error.isErrorResponse) {
    return (
      <div>
        <div className="w-full">
          <div className="text-red-500 text-sm p-4 w-full">
            <code>
              <pre>{error.message}</pre>
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="flex justify-center py-20 text-gray-400 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="text-sm h-full w-full flex-1 flex flex-col">
      {error.reactBound ? (
        <div className="py-2 border-b bg-amber-100 flex items-start px-4 gap-1 flex-shrink-0">
          <InfoIcon strokeWidth={2} className="text-amber-600 mt-0.5" />
          <span className="font-medium text-amber-900">
            There is a known issue with the line numbers of the stack trace when
            the error occurs in a React component. We are working on a fix.
          </span>
        </div>
      ) : null}
      {cannotRenderSource ? (
        <div className="p-3">
          <pre className="font-mono">
            {frame?.methodName ?? "Unable to render source"}
          </pre>
        </div>
      ) : (
        <div className="relative flex-grow">
          <div
            className={cn(
              "absolute top-0 inset-x-0 bg-white border-b z-10 h-7 flex items-center justify-end px-4 w-full"
            )}
          >
            <span
              className="text-gray-400 font-mono truncate rtl"
              style={{ direction: "rtl" }}
            >
              {frame?.file?.replace(appDirectory, "").replace(/^\//, "")}
              <span className="text-transparent">:</span>
              <span className="font-mono text-xs">
                {frame?.lineNumber}:{frame?.column}
              </span>
            </span>
          </div>
          <div className="absolute inset-0 top-7 overflow-scroll">
            <div
              className="w-full *:py-3 *:!bg-transparent bg-white *:w-full [&>pre]:w-full [&>pre]:min-w-fit"
              data-error-code-container="true"
              dangerouslySetInnerHTML={{ __html: source }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
