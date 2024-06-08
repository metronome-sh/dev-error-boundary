import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { DevErrorBoundaryError } from "./useDevBoundaryError";
import { ArrowDownIcon } from "./icon/ArrowDownIcon";
import { codeToHtml } from "shiki";
import { cn } from "./cn";
import { ERROR_BOUNDARY_ERROR_CONTEXT } from "../common/constants";
import { useTheme } from "./useTheme";

export interface ContextProps {
  error: DevErrorBoundaryError;
}

export const Context: FunctionComponent<ContextProps> = ({ error }) => {
  const importantHeaders = [
    "accept",
    "accept-language",
    "cookie",
    "host",
    "user-agent",
  ];

  const [contextCode, setContextCode] = useState<string | null>(null);
  const [paramsCode, setParamsCode] = useState<string | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (error.context) {
      codeToHtml(error.context, {
        lang: "json",
        theme: theme === "dark" ? "github-dark" : "github-light",
      }).then((html) => setContextCode(html));
    }

    if (error.params) {
      codeToHtml(JSON.stringify(error.params, null, 2), {
        lang: "json",
        theme: theme === "dark" ? "github-dark" : "github-light",
      }).then((html) => setParamsCode(html));
    }
  }, [error.context, error.params, theme]);

  // Put important headers first
  const sortedHeaders = useMemo(() => {
    if (!error.request?.headers) return [];

    return error.request.headers.slice().sort(([a], [b]) => {
      return (
        importantHeaders.indexOf(b.toLowerCase()) -
        importantHeaders.indexOf(a.toLowerCase())
      );
    });
  }, [error.request?.headers]);

  const [showAllHeaders, setShowAllHeaders] = useState(false);

  if (
    error.request === null ||
    error.context === null ||
    error.params === null
  ) {
    return (
      <div className="text-gray-500 dark:text-gray-300 p-4 text-center text-sm dark:bg-gray-800 h-full flex justify-center items-center">
        No context available
      </div>
    );
  }

  return (
    <div className="h-full relative dark:bg-gray-800 dark:text-gray-100">
      <div className="absolute inset-0 py-8 flex flex-col gap-8 overflow-y-scroll">
        <div className="px-8 w-full">
          <h4 className="font-medium font-gray-800 border-b border-gray-100 dark:border-gray-600 pb-2">
            Request
          </h4>
          <div className="4">
            <table className="table-auto border-b border-gray-100 dark:border-gray-600 w-full">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr>
                  <td className="text-sm text-gray-500 dark:text-gray-400 pr-8 py-2 w-30">
                    Method
                  </td>
                  <td className="font-mono text-sm">{error.request.method}</td>
                </tr>
                <tr>
                  <td className="text-sm text-gray-500 dark:text-gray-400 pr-8 py-2 w-30">
                    Url
                  </td>
                  <td className="font-mono text-sm">{error.request.url}</td>
                </tr>
                <tr>
                  <td className="text-sm text-gray-500 dark:text-gray-400 pr-8 py-2 align-top w-30">
                    Headers
                  </td>
                  <td className="text-sm">
                    <table className="table-auto">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {sortedHeaders.map(([key, value]) =>
                          importantHeaders.includes(key.toLocaleLowerCase()) ||
                          showAllHeaders ? (
                            <tr key={key}>
                              <td className="text-nowrap min-w-48 py-2 align-top text-gray-500 dark:text-gray-400">
                                {key}
                              </td>
                              <td className="max-w-full break-all">{value}</td>
                            </tr>
                          ) : null
                        )}
                        <tr
                          className={cn({
                            hidden:
                              importantHeaders.length >= sortedHeaders.length ||
                              showAllHeaders,
                          })}
                        >
                          <td className="py-1" colSpan={2}>
                            <button
                              className="text-gray-600 dark:text-gray-300 flex gap-2 items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 py-1 px-2"
                              onClick={() => setShowAllHeaders(true)}
                            >
                              <span>
                                <ArrowDownIcon className="w-3 h-3" />
                              </span>
                              <span>Show all</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="text-sm text-gray-500 dark:text-gray-400 pr-8 py-2 w-30">
                    Body
                  </td>
                  <td className="font-mono text-sm py-2">
                    <pre>{error.request.body ? error.request.body : "-"}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-8 border-t border-gray-100 dark:border-gray-600 py-4">
          <h4 className="font-medium pb-2">Params</h4>
          <div className="text-sm">
            <div
              className="rounded-xl px-4 w-full *:py-3 *:!bg-transparent bg-gray-50 dark:bg-gray-900 *:w-full [&>pre]:w-full [&>pre]:min-w-fit"
              dangerouslySetInnerHTML={{
                __html: paramsCode || "...",
              }}
            />
          </div>
        </div>
        <div className="px-8 border-t border-gray-100 dark:border-gray-600 py-4 w-full">
          <h4 className="font-medium font-gray-800 pb-2">Context</h4>
          <div className="text-sm">
            <div
              className="rounded-xl px-4 w-full *:py-3 *:!bg-transparent bg-gray-50 dark:bg-gray-900 *:w-full [&>pre]:w-full [&>pre]:min-w-fit"
              dangerouslySetInnerHTML={{
                __html: contextCode || "...",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
