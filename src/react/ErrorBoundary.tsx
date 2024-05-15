import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import * as stackTraceParser from "stacktrace-parser";
import { Source } from "./Source";
import { Stack } from "./Stack";
import { ExistingErrorBoundaryBanner } from "./ExistingErrorBoundaryBanner";
import { ErrorHeader } from "./ErrorHeader";
import { ErrorResponse } from "./ErrorResponse";

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

  const isErrorResponse = isRouteErrorResponse(error);

  const stack = useMemo(() => {
    return stackTraceParser.parse((error as Error).stack || "");
  }, [error]);

  const [showOriginalErrorBoundary, setShowOriginalErrorBoundary] =
    useState(false);
  const [readyToRender, setReadyToRender] = useState(false);

  const [selectedFrame, setSelectedFrame] =
    useState<stackTraceParser.StackFrame | null>(() => stack[0] || null);

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
          <ExistingErrorBoundaryBanner
            setShowOriginalErrorBoundary={setShowOriginalErrorBoundary}
          />
        ) : null}
        <ErrorHeader error={error as Error} />
        {isErrorResponse ? (
          <ErrorResponse error={error} />
        ) : (
          <div className="mt-flex-grow mt-overflow-hidden mt-relative mt-pl-80">
            <Stack
              stack={stack}
              appDirectory={appDirectory}
              onSelectFrame={(frame) => setSelectedFrame(frame)}
              selectedFrame={selectedFrame}
            />
            <Source frame={selectedFrame} />
          </div>
        )}
      </div>
    </div>
  );
};
