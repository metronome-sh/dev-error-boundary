import { FunctionComponent } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

export function withErrorBoundary(
  appDirectory: string,
  IncomingErrorBoundary?: React.ComponentType<any>
) {
  const OutgoingErrorBoundary: FunctionComponent = () => {
    return (
      <ErrorBoundary hasErrorBoundary={!!IncomingErrorBoundary} appDirectory={appDirectory}>
        {IncomingErrorBoundary ? <IncomingErrorBoundary /> : null}
      </ErrorBoundary>
    );
  };

  return OutgoingErrorBoundary;
}
