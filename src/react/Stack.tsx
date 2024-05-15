import { FunctionComponent, useCallback, useMemo, useState } from "react";
import * as stackTraceParser from "stacktrace-parser";
import { cn } from "./cn";
import { ExpandIcon } from "./icon/ExpandIcon";
import { CollapseIcon } from "./icon/CollapseIcon";

export interface StackProps {
  stack: stackTraceParser.StackFrame[];
  appDirectory: string;
  onSelectFrame: (frame: stackTraceParser.StackFrame) => void;
  selectedFrame: stackTraceParser.StackFrame | null;
}

export const Stack: FunctionComponent<StackProps> = ({
  stack,
  appDirectory,
  onSelectFrame,
  selectedFrame,
}) => {
  const [expandedIdxs, setExpandedIdxs] = useState<number[]>([]);

  const searchValue = appDirectory.split("/").slice(0, -1).join("/");

  const groupedStack = useMemo(() => {
    return stack.reduce(
      (acc: stackTraceParser.StackFrame[][], frame, index) => {
        const currentFile = frame.file || "";
        const prevFile = index > 0 ? stack[index - 1].file || "" : "";

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
  }, [stack]);

  const expandAllNodeModules = useCallback(() => {
    setExpandedIdxs((prev) =>
      prev.length === 0 ? stack.map((_, i) => i) : []
    );
  }, [stack]);

  return (
    <div className="mt-absolute mt-inset-y-0 mt-left-0 mt-w-80 mt-bg-gray-50 mt-border-r mt-border-gray-200 mt-overflow-y-scroll">
      <button
        className="mt-text-sm mt-py-2 mt-border-b mt-px-4 mt-bg-white mt-w-full mt-flex mt-gap-2 mt-items-center hover:mt-bg-gray-100"
        onClick={expandAllNodeModules}
      >
        <span className="mt-text-gray-600">
          {expandedIdxs.length === 0 ? (
            <ExpandIcon className="mt-w-4 mt-h-4" />
          ) : (
            <CollapseIcon className="mt-w-4 mt-h-4" />
          )}
        </span>
        {expandedIdxs.length === 0 ? "Expand" : "Collapse"}
        <span className="mt-text-xs mt-leading-4 mt-font-mono mt-border mt-border-gray-300 mt-px-1 mt-py-0.5 mt-rounded">
          node_modules
        </span>{" "}
        frames
      </button>
      <ul className="mt-divide-y mt-divide-gray-200 mt-border-b border-b-gray-200">
        {groupedStack.map((frames, index) => {
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
      <li className="mt-text-sm mt-text-gray-500 mt-gap-1">
        <button
          className="mt-w-full mt-text-left mt-py-4 mt-px-4 hover:mt-bg-gray-100 mt-flex mt-items-center mt-justify-between mt-gap-2"
          onClick={() => onExpand(!isExpanded)}
        >
          <span>
            <span>{frames.length}</span>{" "}
            <span className="mt-text-xs mt-leading-4 mt-font-mono mt-border mt-border-gray-300 mt-px-1 mt-py-0.5 mt-rounded">
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
                  "mt-ml-2 mt-w-4 mt-h-4 mt-inline",
                  isExpanded ? "mt-transform mt-rotate-180" : ""
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
            <span className="mt-w-5 mt-h-5 mt-bg-red-500 mt-inline-block mt-rounded" />
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
          "mt-p-4 mt-w-full mt-text-left",
          selectedFrame?.file === frame.file &&
            selectedFrame?.lineNumber === frame.lineNumber
            ? "mt-bg-red-600 mt-text-white"
            : "hover:mt-bg-gray-100 mt-text-gray-700"
        )}
        onClick={() => onSelectFrame(frame)}
      >
        <div className="mt-text-sm mt-break-words">
          {frame.file?.replace(searchValue, "")}
        </div>
      </button>
    </li>
  );
};
