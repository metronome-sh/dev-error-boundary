import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { FunctionComponent } from "react";

interface ExistingErrorBoundaryBannerProps {
  setShowOriginalErrorBoundary: (show: boolean) => void;
}

export const ExistingErrorBoundaryBanner: FunctionComponent<
  ExistingErrorBoundaryBannerProps
> = ({ setShowOriginalErrorBoundary }) => {
  const error = useRouteError();

  return (
    <div className="mt-text-xs mt-text-gray-600 mt-flex mt-gap-2 mt-border-b mt-p-2 mt-justify-center mt-items-center">
      <span>Existing error boundary detected.</span>
      <span
        className="mt-cursor-pointer mt-text-blue-600"
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
        <span className="mt-ml-1 mt-inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mt-w-4 mt-h-4 mt-inline"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </span>
      </span>
    </div>
  );
};
