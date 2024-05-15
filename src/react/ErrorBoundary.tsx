import { FunctionComponent, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useRouteError } from "@remix-run/react";
import * as stackTraceParser from "stacktrace-parser";
import { Source } from "./Source";
import { Stack } from "./Stack";

export interface ErrorBoundaryProps extends PropsWithChildren {
  hasErrorBoundary?: boolean;
  appDirectory: string;
}

export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({
  children,
  hasErrorBoundary,
  appDirectory,
}) => {
  const error = useRouteError();

  const stack = useMemo(() => {
    return stackTraceParser.parse((error as Error).stack || "");
  }, [error]);

  const [showOriginalErrorBoundary, setShowOriginalErrorBoundary] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);

  const [selectedFrame, setSelectedFrame] = useState<stackTraceParser.StackFrame | null>(
    () => stack[0] || null
  );

  useEffect(() => {
    if (showOriginalErrorBoundary) return;

    document.documentElement.classList.add("dev-error-boundary");
    setReadyToRender(true);

    return () => {
      document.documentElement.classList.remove("dev-error-boundary");
    };
  }, [showOriginalErrorBoundary]);

  if (showOriginalErrorBoundary) {
    return <>{children}</>;
  }

  if (!readyToRender) return null;

  return (
    <div className="mt-bg-zinc-50 mt-h-screen mt-py-6">
      <div className="mt-bg-white mt-flex mt-flex-col mt-max-w-screen-xl mt-mx-auto mt-border mt-shadow-md mt-h-full mt-rounded-lg mt-overflow-hidden">
        {hasErrorBoundary ? (
          <div className="mt-text-xs mt-text-gray-600 mt-flex mt-gap-2 mt-border-b mt-p-2 mt-justify-center mt-items-center">
            <span>Existing error boundary detected.</span>
            <span
              className="mt-cursor-pointer mt-text-blue-600"
              onClick={() => setShowOriginalErrorBoundary(true)}
            >
              Render current route error boundary{" "}
              <span className="mt-ml-1 mt-inline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mt-w-4 mt-h-4 mt-inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </span>
          </div>
        ) : null}
        <div className="mt-p-5 mt-border-b mt-flex">
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
            <div className="mt-text-lg mt-font-semibold">{(error as Error).message}</div>
          </div>
        </div>
        <div className="mt-flex-grow mt-overflow-hidden mt-relative mt-pl-80">
          <Stack
            stack={stack}
            appDirectory={appDirectory}
            onSelectFrame={(frame) => setSelectedFrame(frame)}
            selectedFrame={selectedFrame}
          />
          <Source frame={selectedFrame} />
        </div>
      </div>
    </div>
  );
};
