import { useEffect, useState } from "react";
import { DevErrorBoundary } from "../DevErrorBoundary";
import { createPortal } from "react-dom";

export function withErrorBoundary(
  appDirectory: string,
  OriginalErrorBoundary?: React.ComponentType<any>
) {
  return () => {
    const [intercept, setIntercept] = useState(true);

    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
      const container = document.createElement("div");
      // Append to the end of the body
      document.body.appendChild(container);
      setContainer(container);
    }, []);

    if (intercept)
      return container ? (
        createPortal(
          <DevErrorBoundary
            appDirectory={appDirectory}
            onRenderOriginalErrorBoundary={
              OriginalErrorBoundary ? () => setIntercept(false) : undefined
            }
          />,
          container
        )
      ) : (
        <DevErrorBoundary
          appDirectory={appDirectory}
          onRenderOriginalErrorBoundary={
            OriginalErrorBoundary ? () => setIntercept(false) : undefined
          }
        />
      );

    if (OriginalErrorBoundary) return <OriginalErrorBoundary />;

    throw new Error("No ErrorBoundary provided");
  };
}
