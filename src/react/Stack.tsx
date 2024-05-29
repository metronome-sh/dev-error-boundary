import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as stackTraceParser from "stacktrace-parser";
import { cn } from "./cn";
import { DevErrorBoundaryError } from "./useDevBoundaryError";

export interface StackProps {
  error: DevErrorBoundaryError;
  appDirectory: string;
  onSelectFrame: (frame: stackTraceParser.StackFrame) => void;
  selectedFrame: stackTraceParser.StackFrame | null;
}

export const Stack: FunctionComponent<StackProps> = ({
  error,
  appDirectory,
  onSelectFrame,
  selectedFrame,
}) => {
  const [expandedIdxs, setExpandedIdxs] = useState<number[]>([]);

  const searchValue = appDirectory.split("/").slice(0, -1).join("/");

  const groupedStack = useMemo(() => {
    return error.stack.reduce(
      (acc: stackTraceParser.StackFrame[][], frame, index) => {
        const currentFile = frame.file || "";
        const prevFile = index > 0 ? error.stack[index - 1].file || "" : "";

        const isNodeModule = currentFile.includes("node_modules");
        const isPrevNodeModule = prevFile.includes("node_modules");

        if (isNodeModule && isPrevNodeModule) {
          acc[acc.length - 1].push(frame);
        } else {
          acc.push([frame]);
        }

        return acc;
      },
      []
    );
  }, [error.stack]);

  const expandAllNodeModules = useCallback(() => {
    setExpandedIdxs((prev) =>
      prev.length === 0 ? error.stack.map((_, i) => i) : []
    );
  }, [error.stack]);

  // Get from the localstorage the last state of the showFullStack
  const [showHiddenFrames, setShowHiddenFrames] = useState(false);

  useEffect(() => {
    // Check localstorage for the last state of the showFullStack
    const showFullStack = localStorage.getItem(
      "dev-error-boundary:show-full-stack"
    );
    setShowHiddenFrames(showFullStack === "true");
  }, []);

  const canShowFullStack = error.stack.some(
    (frame) =>
      frame.file === "<anonymous>" ||
      frame.file?.includes("node:") ||
      frame.file?.includes("/node_modules/")
  );

  const handleShowHiddenFrames = (checked: boolean) => {
    if (!checked) setExpandedIdxs([]);
    localStorage.setItem("dev-error-boundary:show-full-stack", String(checked));
    setShowHiddenFrames(checked);
  };

  const shouldRenderFrame = (
    frame: stackTraceParser.StackFrame,
    forceShow = false
  ) => {
    if (forceShow) return true;

    const isHiddableFrame =
      frame.file === "<anonymous>" ||
      frame.file?.includes("node:") ||
      frame.file?.includes("/node_modules/");

    return !isHiddableFrame;
  };

  if (error.isErrorResponse) return;

  return (
    <>
      <div className="absolute inset-y-0 left-0 w-80 bg-gray-50 border-r border-gray-200 overflow-y-scroll">
        <div
          className={cn("text-xs px-4 py-2 bg-white", {
            hidden: !canShowFullStack,
          })}
        >
          <div className="text-gray-500 mt-2">
            Some frames were automatically hidden.
          </div>
          <div className="relative flex items-start py-1">
            <div className="flex h-6 items-center">
              <input
                id="show-hidden-frames"
                name="show-hidden-frames"
                type="checkbox"
                className="rounded border-gray-300 checked:border-red-700 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-offset-0 focus:ring-red-200 focus:ring-opacity-50 cursor-pointer"
                onChange={(e) => handleShowHiddenFrames(e.target.checked)}
                checked={showHiddenFrames}
              />
            </div>
            <div className="ml-2 text-xs leading-6 w-full">
              <label
                htmlFor="show-hidden-frames"
                className="text-gray-900 w-full inline-block cursor-pointer"
              >
                Show hidden frames
              </label>
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200 border-b border-b-gray-200">
          {groupedStack.map((frames, index) => {
            const shouldRender = shouldRenderFrame(frames[0], showHiddenFrames);

            if (!shouldRender) return null;

            if (frames.length === 1) {
              return (
                <Frame
                  key={index}
                  frame={frames[0]}
                  onSelectFrame={onSelectFrame}
                  selectedFrame={selectedFrame}
                  searchValue={searchValue}
                />
              );
            }

            return (
              <NodeModulesFrames
                key={index}
                frames={frames}
                onSelectFrame={onSelectFrame}
                selectedFrame={selectedFrame}
                onExpand={(next) =>
                  setExpandedIdxs((prev) =>
                    next ? [...prev, index] : prev.filter((i) => i !== index)
                  )
                }
                isExpanded={expandedIdxs.includes(index)}
                searchValue={searchValue}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

interface NodeModulesFramesProps {
  frames: stackTraceParser.StackFrame[];
  onExpand: (next: boolean) => void;
  isExpanded?: boolean;
  selectedFrame: stackTraceParser.StackFrame | null;
  onSelectFrame: (frame: stackTraceParser.StackFrame) => void;
  searchValue: string;
}

const NodeModulesFrames: FunctionComponent<NodeModulesFramesProps> = ({
  onExpand,
  frames,
  isExpanded,
  selectedFrame,
  onSelectFrame,
  searchValue,
}) => {
  const hasSelectedFrame = frames.some(
    (frame) => JSON.stringify(frame) === JSON.stringify(selectedFrame)
  );

  return (
    <>
      <li className="text-sm text-gray-500 gap-1">
        <button
          className="w-full text-left py-4 px-4 hover:bg-gray-100 flex items-center justify-between gap-2"
          onClick={() => onExpand(!isExpanded)}
        >
          <span>
            <span>{frames.length}</span>{" "}
            <span className="text-xs leading-4 font-mono border border-gray-300 px-1 py-0.5 rounded">
              node_modules
            </span>{" "}
            frames
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={cn(
                  "ml-2 w-4 h-4 inline",
                  isExpanded ? "transform rotate-180" : ""
                )}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </span>
          {hasSelectedFrame && !isExpanded ? (
            <span className="w-5 h-5 bg-red-500 inline-block rounded" />
          ) : null}
        </button>
      </li>
      {isExpanded ? (
        <ul className="block">
          {frames.map((frame, index) => (
            <Frame
              key={index}
              frame={frame}
              onSelectFrame={onSelectFrame}
              selectedFrame={selectedFrame}
              searchValue={searchValue}
            />
          ))}
        </ul>
      ) : null}
    </>
  );
};

interface FrameProps {
  frame: stackTraceParser.StackFrame;
  onSelectFrame: (frame: stackTraceParser.StackFrame) => void;
  selectedFrame: stackTraceParser.StackFrame | null;
  searchValue: string;
}

const Frame: FunctionComponent<FrameProps> = ({
  frame,
  searchValue,
  onSelectFrame,
  selectedFrame,
}) => {
  return (
    <li>
      <button
        className={cn(
          "p-4 w-full text-left",
          selectedFrame?.file === frame.file &&
            selectedFrame?.lineNumber === frame.lineNumber
            ? "bg-red-600 text-white"
            : "hover:bg-gray-100 text-gray-700"
        )}
        onClick={() => onSelectFrame(frame)}
      >
        <div className="text-sm break-words">
          {frame.file?.replace(searchValue, "")}{" "}
          {frame.file !== "<anonymous>" ? (
            <span className="font-mono text-xs text-opacity-80">
              {frame.lineNumber}:{frame.column}
            </span>
          ) : null}
        </div>
      </button>
    </li>
  );
};
