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

  const [selectedFrame, setSelectedFrame] =
    useState<stackTraceParser.StackFrame | null>(() => stack[0] || null);

  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);

  const handleShowOriginalErrorBoundary = () => {
    // Remove all dev-error-boundary styles
    const styles = document.querySelectorAll("style");

    styles.forEach((style) => {
      if (
        style.innerHTML.includes("dev-error-boundary") ||
        style.getAttribute("data-vite-dev-id")?.includes("dev-error-boundary")
      ) {
        style.remove();
      }
    });

    setShowOriginalErrorBoundary(true);
  };

  if (!render) return null;

  if (showOriginalErrorBoundary) {
    return children;
  }

  return (
    <div className="bg-zinc-50 h-screen py-6">
      <div className="bg-white flex flex-col max-w-screen-xl mx-auto border shadow-md h-full rounded-lg overflow-hidden">
        {hasErrorBoundary ? (
          <ExistingErrorBoundaryBanner
            setShowOriginalErrorBoundary={handleShowOriginalErrorBoundary}
          />
        ) : null}
        <ErrorHeader error={error} />
        <Tabs defaultValue="stack" className="flex flex-col flex-grow">
          <Tabs.List className="flex-shrink-0">
            <Tabs.Trigger icon={<StackIcon />} value="stack">
              Stack
            </Tabs.Trigger>
            <Tabs.Trigger icon={<ContextIcon />} value="context">
              Context
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="stack"
            className={cn("relative flex-grow w-full", {
              "pl-80": !error.isErrorResponse,
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
          <Tabs.Content value="context" className="flex-grow">
            <Context error={error} />
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
};
