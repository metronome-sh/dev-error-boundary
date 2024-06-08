import { FunctionComponent, useEffect, useMemo, useState } from "react";
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
import { ThemeSelector } from "./ThemeSelector";
import { useTheme } from "./useTheme";

export interface DevErrorBoundaryProps {
  onRenderOriginalErrorBoundary?: () => void;
  appDirectory: string;
}

export const DevErrorBoundary: FunctionComponent<DevErrorBoundaryProps> = ({
  onRenderOriginalErrorBoundary,
  appDirectory,
}) => {
  const error = useDevBoundaryError();

  const [selectedFrame, setSelectedFrame] =
    useState<stackTraceParser.StackFrame | null>(null);

  useEffect(() => {
    // Find the first frame that is not anonymous, or node_modules or not a node:

    const found = error?.stack.find((frame) => {
      return (
        frame.file !== "<anonymous>" &&
        !frame.file?.includes("node_modules") &&
        !frame.file?.includes("node:")
      );
    });

    setSelectedFrame(found ?? error?.stack[0] ?? null);
  }, [error]);

  const { theme } = useTheme();

  if (!error || !theme) return null;

  return (
    <div
      className={cn(
        "dev-error-boundary",
        theme === "dark" ? "dev-error-boundary-dark" : ""
      )}
      style={{ display: "none" }}
    >
      <div className="!absolute inset-0 z-[2147483647] text-black dark:text-white">
        <div className="bg-white dark:bg-gray-900 flex flex-col w-full border dark:border-gray-600 shadow-md h-full overflow-hidden">
          {onRenderOriginalErrorBoundary != undefined ? (
            <ExistingErrorBoundaryBanner
              setShowOriginalErrorBoundary={onRenderOriginalErrorBoundary}
            />
          ) : null}
          <ErrorHeader error={error} />
          <Tabs defaultValue="stack" className="flex flex-col flex-grow">
            <Tabs.List className="flex-shrink-0 flex justify-between pt-0">
              <div className="flex-grow h-9">
                <Tabs.Trigger icon={<StackIcon />} value="stack">
                  Stack
                </Tabs.Trigger>
                <Tabs.Trigger icon={<ContextIcon />} value="context">
                  Context
                </Tabs.Trigger>
              </div>
              <div className="flex-shrink-0">
                <ThemeSelector />
              </div>
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
