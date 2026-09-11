/**
 * Transport contract shared by every route handler and the browser client.
 *
 * Responses are always a discriminated union on `ok`, so callers are forced by
 * the type system to handle failure before touching `data`.
 */

export type ApiErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "conflict"
  | "not_found"
  | "rate_limited"
  | "payload_too_large"
  | "unsupported_media_type"
  | "internal_error";

export type ApiFieldError = {
  path: string;
  message: string;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    /** Field-level detail for validation failures. */
    fields?: ApiFieldError[];
    /**
     * Machine-readable discriminator for cases the UI must branch on, where the
     * HTTP code alone is not specific enough — e.g. telling "no account with
     * that number" apart from "that number already has one", both of which are
     * a 409. Never parse `message` for this; it is prose and will change.
     */
    reason?: string;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Maps an error code to the HTTP status the handler should respond with. */
export const API_ERROR_STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  conflict: 409,
  not_found: 404,
  rate_limited: 429,
  payload_too_large: 413,
  unsupported_media_type: 415,
  internal_error: 500,
};

/** Receipt returned by the newsletter, contact and order endpoints. */
export type SubmissionReceipt = {
  id: string;
  receivedAt: string;
  message: string;
};
