import "server-only";

import type { ZodError, ZodType } from "zod";

import { API_ERROR_STATUS, type ApiErrorCode, type ApiFieldError } from "@/types/api";
import { createRequestId, logger, toErrorContext } from "@/lib/observability/logger";
import { isSameOrigin } from "@/lib/api/csrf";
import { getCurrentUser } from "@/lib/services/auth.service";
import type { User } from "@/types/account";

/**
 * HTTP plumbing for route handlers: one response envelope, one error shape, one
 * place where status codes and cache headers are decided.
 */

const MAX_BODY_BYTES = 32 * 1024;

export function jsonOk<T>(
  data: T,
  init?: { status?: number; headers?: Record<string, string> },
): Response {
  return Response.json(
    { ok: true, data },
    {
      status: init?.status ?? 200,
      headers: {
        "Cache-Control": "no-store",
        ...init?.headers,
      },
    },
  );
}

export function jsonError(
  code: ApiErrorCode,
  message: string,
  init?: {
    fields?: ApiFieldError[];
    /** Discriminator for UI branching. See `ApiFailure` for why. */
    reason?: string;
    headers?: Record<string, string>;
  },
): Response {
  return Response.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(init?.fields ? { fields: init.fields } : {}),
        ...(init?.reason ? { reason: init.reason } : {}),
      },
    },
    {
      status: API_ERROR_STATUS[code],
      headers: {
        "Cache-Control": "no-store",
        ...init?.headers,
      },
    },
  );
}

/** Flattens a ZodError into the transport's field-error shape. */
export function toFieldErrors(error: ZodError): ApiFieldError[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join(".") || "_",
    message: issue.message,
  }));
}

/** Parses and validates URL search params against a schema. */
export function parseQuery<T>(
  url: URL,
  schema: ZodType<T>,
): { ok: true; data: T } | { ok: false; response: Response } {
  const raw = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    return {
      ok: false,
      response: jsonError("bad_request", "Invalid query parameters.", {
        fields: toFieldErrors(result.error),
      }),
    };
  }

  return { ok: true, data: result.data };
}

/**
 * Reads and validates a JSON request body.
 *
 * Enforces content type and a hard size cap before parsing, so a malformed or
 * oversized payload is rejected without being deserialized.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: jsonError("unsupported_media_type", "Expected application/json."),
    };
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: jsonError("payload_too_large", "Request body is too large."),
    };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return {
      ok: false,
      response: jsonError("bad_request", "Could not read request body."),
    };
  }

  if (raw.length > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: jsonError("payload_too_large", "Request body is too large."),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      response: jsonError("bad_request", "Request body is not valid JSON."),
    };
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      response: jsonError("bad_request", "Some details need attention.", {
        fields: toFieldErrors(result.error),
      }),
    };
  }

  return { ok: true, data: result.data };
}

/**
 * Wraps a handler so no unhandled exception ever escapes as an opaque 500 with
 * a stack trace. The error is logged with a correlation id; the client receives
 * only that id.
 */
export async function withErrorHandling(
  route: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  const requestId = createRequestId();

  try {
    const response = await handler();
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error) {
    logger.error("Unhandled error in route handler", {
      route,
      requestId,
      ...toErrorContext(error),
    });

    return jsonError(
      "internal_error",
      "Something went wrong at our end. Please try again.",
      { headers: { "x-request-id": requestId } },
    );
  }
}

/**
 * Rejects a state-changing request that did not originate from this site.
 *
 * Call at the top of every mutating handler, before any work is done.
 */
export function guardSameOrigin(request: Request): Response | null {
  if (isSameOrigin(request)) return null;

  logger.warn("Blocked a cross-origin state-changing request", {
    origin: request.headers.get("origin") ?? "none",
    path: new URL(request.url).pathname,
  });

  return jsonError("forbidden", "This request did not come from this site.");
}

/**
 * Resolves the signed-in user, or returns a 401 response for the caller to
 * return directly. Keeps the auth check to two lines in each handler.
 */
export async function requireApiUser(): Promise<
  { ok: true; user: User } | { ok: false; response: Response }
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      response: jsonError("unauthorized", "Please sign in to continue."),
    };
  }

  return { ok: true, user };
}
