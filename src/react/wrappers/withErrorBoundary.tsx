import { useState } from "react";
import { DevErrorBoundary } from "../DevErrorBoundary";

export function withErrorBoundary(
  appDirectory: string,
  OriginalErrorBoundary?: React.ComponentType<any>
) {
  return () => {
    const [intercept, setIntercept] = useState(true);

    if (intercept)
      return (
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
