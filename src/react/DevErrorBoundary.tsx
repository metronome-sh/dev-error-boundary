import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as stackTraceParser from "stacktrace-parser";
import { Source } from "./Source";
import { Stack } from "./Stack";
import { ExistingErrorBoundaryBanner } from "./ExistingErrorBoundaryBanner";
import { ErrorHeader } from "./ErrorHeader";
import { ErrorResponse } from "./ErrorResponse";
import { useDevBoundaryError } from "./useDevBoundaryError";
import { StackIcon } from "./icon/StackIcon";
import { ContextIcon } from "./icon/ContextIcon";

export interface DevErrorBoundaryProps extends PropsWithChildren {
  hasErrorBoundary?: boolean;
  appDirectory: string;
}

export const DevErrorBoundary: FunctionComponent<DevErrorBoundaryProps> = ({
  children,
  hasErrorBoundary,
  appDirectory,
}) => {
  const error = useDevBoundaryError();

  console.log({ error });

  const stack = useMemo(() => {
    if (error.isErrorResponse) return [];

    return stackTraceParser.parse(error.stack);
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
        <ErrorHeader error={error} />
        <div className="mt-border-b mt-border-gray-200 mt-flex mt-gap-0 mt-text-sm mt-px-4 mt-pt-1">
          <div className="mt-bg-gray-200 mt-py-1 mt-px-4 mt-rounded-t-md mt-flex mt-items-center mt-gap-2">
            <span>
              <StackIcon />
            </span>
            Stack
          </div>
          <div className="mt-bg-gray-50 mt-py-1 mt-px-4 mt-rounded-t-md mt-flex mt-items-center mt-gap-2">
            <span>
              <ContextIcon />
            </span>
            Context
          </div>
        </div>
        {error.isErrorResponse ? (
          <ErrorResponse error={error} />
        ) : (
          <div className="mt-flex-grow mt-overflow-hidden mt-relative mt-pl-80">
            <Stack
              stack={stack}
              appDirectory={appDirectory}
              onSelectFrame={(frame) => setSelectedFrame(frame)}
              selectedFrame={selectedFrame}
            />
            <Source appDirectory={appDirectory} frame={selectedFrame} />
          </div>
        )}
      </div>
    </div>
  );
};
