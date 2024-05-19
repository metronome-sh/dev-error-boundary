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
import { useDevBoundaryError } from "./useDevBoundaryError";
import { StackIcon } from "./icon/StackIcon";
import { ContextIcon } from "./icon/ContextIcon";
import { Tabs } from "./Tabs";
import { cn } from "./cn";
import { Context } from "./Context";

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
    return children;
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
        <Tabs defaultValue="stack" className="mt-flex mt-flex-col mt-flex-grow">
          <Tabs.List className="mt-flex-shrink-0">
            <Tabs.Trigger icon={<StackIcon />} value="stack">
              Stack
            </Tabs.Trigger>
            <Tabs.Trigger icon={<ContextIcon />} value="context">
              Context
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="stack"
            className={cn("mt-relative mt-flex-grow mt-w-full", {
              "mt-pl-80": !error.isErrorResponse,
            })}
          >
            <Stack
              error={error}
              appDirectory={appDirectory}
              onSelectFrame={(frame) => setSelectedFrame(frame)}
              selectedFrame={selectedFrame}
            />
            <Source
              error={error}
              appDirectory={appDirectory}
              frame={selectedFrame}
            />
          </Tabs.Content>
          <Tabs.Content value="context" className="mt-flex-grow">
            <Context error={error} />
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
};
