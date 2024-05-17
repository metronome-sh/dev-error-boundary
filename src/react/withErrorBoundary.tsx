import { DevErrorBoundary } from "./DevErrorBoundary";

export function withErrorBoundary(
  appDirectory: string,
  IncomingErrorBoundary?: React.ComponentType<any>
) {
  return () => {
    return (
      <DevErrorBoundary
        hasErrorBoundary={!!IncomingErrorBoundary}
        appDirectory={appDirectory}
      >
        {IncomingErrorBoundary ? <IncomingErrorBoundary /> : null}
      </DevErrorBoundary>
    );
  };
}
