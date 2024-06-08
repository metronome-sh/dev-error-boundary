import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { FunctionComponent } from "react";
import { ArrowLeftIcon } from "./icon/ArrowLeftIcon";

interface ExistingErrorBoundaryBannerProps {
  setShowOriginalErrorBoundary: (show: boolean) => void;
}

export const ExistingErrorBoundaryBanner: FunctionComponent<
  ExistingErrorBoundaryBannerProps
> = ({ setShowOriginalErrorBoundary }) => {
  const error = useRouteError();

  return (
    <div className="h-11 text-xs text-gray-600 dark:text-gray-400 flex gap-2 border-b dark:border-gray-700 p-2 justify-center items-center">
      <span>Existing error boundary detected.</span>
      <span
        className="cursor-pointer text-blue-600 dark:text-blue-400"
        onClick={() => {
          if (isRouteErrorResponse(error)) {
            const parsed = JSON.parse(error.data);
            error.data = parsed.__original;
          } else {
            const parsed = JSON.parse((error as Error).message);
            (error as Error).message = parsed.__original;
          }

          setShowOriginalErrorBoundary(true);
        }}
      >
        Render current route error boundary{" "}
        <span className="ml-1 inline">
          <ArrowLeftIcon />
        </span>
      </span>
    </div>
  );
};
