import { FunctionComponent, useEffect, useState } from "react";
import * as stackTraceParser from "stacktrace-parser";
import { ERROR_BOUNDARY_ROUTE_PATH } from "../common/constants";

export interface SourceProps {
  frame: stackTraceParser.StackFrame | null;
}

export const Source: FunctionComponent<SourceProps> = ({ frame }) => {
  const [source, setSource] = useState(null);

  useEffect(() => {
    console.log({ frame });

    if (!frame || !frame.file || frame.file === "<anonymous>") return;

    setSource(null);

    fetch(ERROR_BOUNDARY_ROUTE_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frame }),
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
  }, [frame, source]);

  if (!source)
    return (
      <div className="mt-flex mt-justify-center mt-py-20 mt-text-gray-400 mt-w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mt-w-6 mt-h-6 mt-animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    );

  const isAnonymous = frame?.file === "<anonymous>";

  return (
    <div className="mt-text-sm mt-h-full mt-w-full mt-flex-1">
      {isAnonymous ? (
        <div className="mt-p-3">
          <span className="mt-font-mono">
            <span className="mt-text-gray-600">method: </span>
            {frame.methodName}
          </span>
        </div>
      ) : (
        <div className="mt-h-full mt-overflow-scroll">
          <div
            className="mt-w-full *:mt-py-3 *:!mt-bg-transparent mt-bg-white *:mt-w-full [&>pre]:mt-w-full [&>pre]:mt-min-w-fit"
            data-error-code-container="true"
            dangerouslySetInnerHTML={{ __html: source }}
          />
        </div>
      )}
    </div>
  );
};
