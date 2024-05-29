import { isRouteErrorResponse } from "@remix-run/react";
import { json, type ActionFunction } from "@remix-run/server-runtime";
import { simpleHash } from "../common/simpleHash";

const replacer = (key: string, value: any) => {
  // Handle functions
  if (typeof value === "function") {
    return `[Function ${value.toString()}]`;
  }

  // Handle BigInts
  if (typeof value === "bigint") {
    return `[BigInt(${value.toString()})]`;
  }

  // Handle Maps
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  }

  // Handle Sets
  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value.values()),
    };
  }

  // Handle Dates
  if (value instanceof Date) {
    return `[Date(${value.toISOString()})]`;
  }

  // Handle RegExps
  if (value instanceof RegExp) {
    return `[RegExp(${value.toString()})]`;
  }

  // Handle Errors
  if (value instanceof Error) {
    return {
      dataType: "Error",
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  // Handle generic objects
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.constructor.name !== "Object"
  ) {
    return `[${value.constructor.name}]`;
  }

  return value;
};

export function createLastErrorRouteModule() {
  const action: ActionFunction = async ({ request }) => {
    const lastError = globalThis.__DEV_ERROR_BOUNDARY_LAST_ERROR;

    if (!lastError) return json({ context: null });

    const { hash: incomingHash } = await request.json();

    // prettier-ignore
    const currentHash = isRouteErrorResponse(lastError.error)
      ? simpleHash(lastError.error.data + lastError.error.status + lastError.error.statusText)
      : simpleHash((lastError.error as Error).message + (lastError.error as Error).stack);

    if (incomingHash !== currentHash) {
      globalThis.__DEV_ERROR_BOUNDARY_LAST_ERROR = undefined;
      return json({ context: null });
    }

    let serializedContext = "{}";

    try {
      serializedContext = JSON.stringify(lastError.context, replacer, 2);
    } catch (error) {
      serializedContext = JSON.stringify(lastError.context, null, 2);
    }

    const requestSnapshot = {
      method: lastError.request.method,
      url: lastError.request.url,
      headers: [...lastError.request.headers.entries()],
      body: lastError.request.body,
    };

    return json({
      context: {
        context: serializedContext,
        request: requestSnapshot,
        params: lastError.params,
      },
    });
  };

  return { action, default: undefined };
}
