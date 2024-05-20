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
    <div className="text-xs text-gray-600 flex gap-2 border-b p-2 justify-center items-center">
      <span>Existing error boundary detected.</span>
      <span
        className="cursor-pointer text-blue-600"
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 inline"
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
