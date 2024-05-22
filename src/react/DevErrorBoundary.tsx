import { FunctionComponent, useMemo, useState } from "react";
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

export interface DevErrorBoundaryProps {
  onRenderOriginalErrorBoundary?: () => void;
  appDirectory: string;
}

export const DevErrorBoundary: FunctionComponent<DevErrorBoundaryProps> = ({
  onRenderOriginalErrorBoundary,
  appDirectory,
}) => {
  const error = useDevBoundaryError();

  const stack = useMemo(() => {
    if (error.isErrorResponse) return [];

    return stackTraceParser.parse(error.stack);
  }, [error]);

  const [selectedFrame, setSelectedFrame] =
    useState<stackTraceParser.StackFrame | null>(() => stack[0] || null);

  // useEffect(() => {
  //   const styles = document.querySelectorAll(
  //     "link[rel=stylesheet]"
  //   ) as NodeListOf<HTMLLinkElement>;

  //   // Disable all styles except the dev-error-boundary styles
  //   styles.forEach((style) => {
  //     if (style.id === "dev-error-boundary-styles") style.disabled = false;
  //     else style.disabled = true;
  //   });

  //   return () => {
  //     // Re-enable all styles and disable the dev-error-boundary styles
  //     styles.forEach((style) => {
  //       if (style.id === "dev-error-boundary-styles") style.disabled = true;
  //       else style.disabled = false;
  //     });
  //   };
  // }, []);

  return (
    <div className="dev-error-boundary" style={{ display: "none" }}>
      <div className="bg-zinc-50 h-screen !absolute top-0 bottom-0 left-0 right-0">
        <div className="bg-white flex flex-col w-full border shadow-md h-full overflow-hidden">
          {onRenderOriginalErrorBoundary ? (
            <ExistingErrorBoundaryBanner
              setShowOriginalErrorBoundary={onRenderOriginalErrorBoundary}
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
    </div>
  );
};
