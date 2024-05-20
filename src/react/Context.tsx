import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { DevErrorBoundaryError } from "./useDevBoundaryError";
import { ArrowDownIcon } from "./icon/ArrowDownIcon";
import { codeToHtml } from "shiki";
import { cn } from "./cn";

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

  useEffect(() => {
    if (error.context) {
      codeToHtml(JSON.stringify(error.context, null, 2), {
        lang: "json",
        theme: "light-plus",
      }).then((html) => {
        setContextCode(html);
      });
    }
  }, [error]);

  // Put important headers first
  const sortedHeaders = useMemo(() => {
    return error.request.headers.slice().sort(([a], [b]) => {
      return (
        importantHeaders.indexOf(b.toLowerCase()) -
        importantHeaders.indexOf(a.toLowerCase())
      );
    });
  }, [error.request.headers]);

  const [showAllHeaders, setShowAllHeaders] = useState(false);

  return (
    <div className="mt-h-full mt-relative">
      <div className="mt-absolute mt-inset-0 mt-py-8 mt-flex mt-flex-col mt-gap-8 mt-overflow-y-scroll">
        <div className="mt-px-8 mt-w-full">
          <h4 className="mt-font-medium mt-font-gray-800 mt-border-b mt-border-gray-100 mt-pb-2">
            Request
          </h4>
          <div className="mt-mt-4">
            <table className="mt-table-auto mt-border-b mt-w-full">
              <tbody className="mt-divide-y mt-divide-gray-200">
                <tr>
                  <td className="mt-text-sm mt-text-gray-500 mt-pr-8 mt-py-2 mt-w-30">
                    Method
                  </td>
                  <td className="mt-font-mono mt-text-sm">
                    {error.request.method}
                  </td>
                </tr>
                <tr>
                  <td className="mt-text-sm mt-text-gray-500 mt-pr-8 mt-py-2 mt-w-30">
                    Url
                  </td>
                  <td className="mt-font-mono mt-text-sm">
                    {error.request.url}
                  </td>
                </tr>
                <tr>
                  <td className="mt-text-sm mt-text-gray-500 mt-pr-8 mt-py-2 mt-align-top mt-w-30">
                    Headers
                  </td>
                  <td className="mt-text-sm">
                    <table className="mt-table-auto">
                      <tbody className="mt-divide-y mt-divide-gray-200">
                        {sortedHeaders.map(([key, value]) =>
                          importantHeaders.includes(key.toLocaleLowerCase()) ||
                          showAllHeaders ? (
                            <tr key={key}>
                              <td className="mt-text-nowrap mt-min-w-48 mt-py-2 mt-align-top mt-text-gray-500">
                                {key}
                              </td>
                              <td className="mt-max-w-ful mt-break-words">
                                {value}
                              </td>
                            </tr>
                          ) : null
                        )}
                        <tr
                          className={cn({
                            "mt-hidden":
                              importantHeaders.length >= sortedHeaders.length ||
                              showAllHeaders,
                          })}
                        >
                          <td className="mt-py-1" colSpan={2}>
                            <button
                              className="mt-text-gray-600 mt-flex mt-gap-2 mt-items-center mt-rounded hover:mt-bg-gray-100 mt-py-1 mt-px-2"
                              onClick={() => setShowAllHeaders(true)}
                            >
                              <span>
                                <ArrowDownIcon className="mt-w-3 mt-h-3" />
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
                  <td className="mt-text-sm mt-text-gray-500 mt-pr-8 mt-py-2 mt-w-30">
                    Body
                  </td>
                  <td className="mt-font-mono mt-text-sm mt-py-2">
                    <pre>{error.request.body ? error.request.body : "-"}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-px-8 mt-border-t mt-py-4">
          <h4 className="mt-font-medium">Params</h4>
          <div>
            <div className="mt-mt-4">
              <table className="mt-table-auto mt-border-b mt-w-full">
                <tbody className="mt-divide-y mt-divide-gray-200">
                  {Object.entries(error.params).map(([key, value]) => (
                    <tr key={key}>
                      <td className="mt-text-sm mt-text-gray-500 mt-pr-8 mt-py-2 mt-w-30">
                        {key}
                      </td>
                      <td className="mt-font-mono mt-text-sm">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-px-8 mt-border-t mt-py-4 mt-w-full">
          <h4 className="mt-font-medium mt-font-gray-800 mt-border-b mt-border-gray-100 mt-pb-2">
            Context
          </h4>
          <div className="mt-mt-4 mt-text-sm">
            <div
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
