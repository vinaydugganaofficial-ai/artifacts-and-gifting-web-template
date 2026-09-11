import type { ApiResult, SubmissionReceipt } from "@/types/api";
import type { Paginated, Product } from "@/types/product";
import type {
  AddressFormInput,
  ContactInput,
  NewsletterInput,
  OtpRequestInput,
  OtpVerifyInput,
  PlaceOrderFormInput,
  ProfileInput,
  QuoteInput,
  TrackOrderInput,
} from "@/lib/api/schemas";
import type { Address, OtpChallengeView, User } from "@/types/account";
import type { CouponOffer } from "@/types/coupon";
import type { OrderStatus, OrderStatusEvent, OrderTotals } from "@/types/order";
import type { PricedCart } from "@/lib/services/order.types";

/** Receipt returned by `POST /api/orders`. */
export type PlacedOrderReceipt = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  totals: OrderTotals;
  itemCount: number;
  estimatedDelivery?: string;
  /** E.164. The identity the order is tracked by. */
  phone: string;
  email?: string;
  paymentMethod: string;
};

/** The public projection returned by `POST /api/orders/track`. */
export type TrackedOrder = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  history: OrderStatusEvent[];
  estimatedDelivery?: string;
  trackingNumber?: string;
  itemCount: number;
  total: number;
  recipient: string;
  city: string;
  lines: Array<{
    name: string;
    slug: string;
    image: string;
    imageAlt: string;
    quantity: number;
  }>;
};

/**
 * Typed browser client for the storefront API.
 *
 * Client Components talk to the server exclusively through this module. Nothing
 * here imports catalog data, so the product catalog is never bundled into the
 * client JavaScript regardless of how large it grows.
 *
 * Every call resolves to an `ApiResult` — network failures, timeouts and HTTP
 * errors all become a typed failure rather than a thrown exception, so callers
 * cannot forget to handle them.
 */

const DEFAULT_TIMEOUT_MS = 10_000;

export type RequestOptions = {
  /** Caller-owned signal, e.g. to cancel on unmount or on the next keystroke. */
  signal?: AbortSignal;
  timeoutMs?: number;
};

function failure(message: string): ApiResult<never> {
  return { ok: false, error: { code: "internal_error", message } };
}

async function request<T>(
  path: string,
  init: RequestInit,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Bridge the caller's signal onto ours rather than using AbortSignal.any(),
  // which is not available across the browser range this app supports.
  const external = options.signal;
  const forwardAbort = () => controller.abort();
  if (external) {
    if (external.aborted) controller.abort();
    else external.addEventListener("abort", forwardAbort, { once: true });
  }

  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", ...init.headers },
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return failure("The server returned an unreadable response.");
    }

    if (isApiResult<T>(payload)) return payload;

    return failure("The server returned an unexpected response.");
  } catch (error) {
    // An abort the caller asked for is not an error worth surfacing as one.
    if (external?.aborted) return failure("Request cancelled.");
    if (error instanceof DOMException && error.name === "AbortError") {
      return failure("The request timed out. Please try again.");
    }
    return failure("Could not reach the server. Check your connection.");
  } finally {
    clearTimeout(timer);
    external?.removeEventListener("abort", forwardAbort);
  }
}

function isApiResult<T>(value: unknown): value is ApiResult<T> {
  if (typeof value !== "object" || value === null || !("ok" in value)) return false;
  const candidate = value as { ok: unknown };
  return typeof candidate.ok === "boolean";
}

function get<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
  return request<T>(path, { method: "GET" }, options);
}

function post<T>(
  path: string,
  body: unknown,
  options?: RequestOptions,
): Promise<ApiResult<T>> {
  return request<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    options,
  );
}

/* -------------------------------------------------------------------------- */
/* Catalog                                                                     */
/* -------------------------------------------------------------------------- */

export function fetchProductBySlug(
  slug: string,
  options?: RequestOptions,
): Promise<ApiResult<Product>> {
  return get<Product>(`/api/products/${encodeURIComponent(slug)}`, options);
}

export function fetchProducts(
  params: Record<string, string | number | boolean | undefined>,
  options?: RequestOptions,
): Promise<ApiResult<Paginated<Product>>> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return get<Paginated<Product>>(`/api/products${query ? `?${query}` : ""}`, options);
}

/** Resolves ids held in browser storage. Unknown ids are omitted by the server. */
export function fetchProductsByIds(
  ids: readonly string[],
  options?: RequestOptions,
): Promise<ApiResult<Product[]>> {
  if (ids.length === 0) return Promise.resolve({ ok: true, data: [] });
  const query = new URLSearchParams({ ids: ids.join(",") }).toString();
  return get<Product[]>(`/api/products/by-id?${query}`, options);
}

export function searchCatalog(
  query: string,
  options?: RequestOptions,
): Promise<ApiResult<Product[]>> {
  const search = new URLSearchParams({ q: query }).toString();
  return get<Product[]>(`/api/search?${search}`, options);
}

/* -------------------------------------------------------------------------- */
/* Submissions                                                                 */
/* -------------------------------------------------------------------------- */

export function submitNewsletter(
  input: NewsletterInput,
  options?: RequestOptions,
): Promise<ApiResult<SubmissionReceipt>> {
  return post<SubmissionReceipt>("/api/newsletter", input, options);
}

export function submitContact(
  input: ContactInput,
  options?: RequestOptions,
): Promise<ApiResult<SubmissionReceipt>> {
  return post<SubmissionReceipt>("/api/contact", input, options);
}

/* -------------------------------------------------------------------------- */
/* Authentication                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Asks for a one-time code.
 *
 * Resending is the same call with the same phone and purpose — the server owns
 * the cooldown, so the client cannot shorten it by asking again.
 */
export function requestOtp(
  input: OtpRequestInput,
  options?: RequestOptions,
): Promise<ApiResult<OtpChallengeView>> {
  return post<OtpChallengeView>("/api/auth/otp/request", input, options);
}

/** Redeems a code. On success the session cookie is already set. */
export function verifyOtp(
  input: OtpVerifyInput,
  options?: RequestOptions,
): Promise<ApiResult<{ user: User; created: boolean }>> {
  return post<{ user: User; created: boolean }>("/api/auth/otp/verify", input, options);
}

export function signOut(
  options?: RequestOptions,
): Promise<ApiResult<{ signedOut: boolean }>> {
  return post<{ signedOut: boolean }>("/api/auth/logout", {}, options);
}

export function fetchSession(
  options?: RequestOptions,
): Promise<ApiResult<{ user: User | null }>> {
  return get<{ user: User | null }>("/api/auth/session", options);
}

/* -------------------------------------------------------------------------- */
/* Account                                                                     */
/* -------------------------------------------------------------------------- */

export function updateProfile(
  input: ProfileInput,
  options?: RequestOptions,
): Promise<ApiResult<User>> {
  return request<User>(
    "/api/account/profile",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    options,
  );
}

export function fetchAddresses(options?: RequestOptions): Promise<ApiResult<Address[]>> {
  return get<Address[]>("/api/account/addresses", options);
}

export function createAddress(
  input: AddressFormInput,
  options?: RequestOptions,
): Promise<ApiResult<Address>> {
  return post<Address>("/api/account/addresses", input, options);
}

export function updateAddress(
  id: string,
  input: AddressFormInput,
  options?: RequestOptions,
): Promise<ApiResult<Address>> {
  return request<Address>(
    `/api/account/addresses/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    options,
  );
}

export function deleteAddress(
  id: string,
  options?: RequestOptions,
): Promise<ApiResult<{ deleted: boolean }>> {
  return request<{ deleted: boolean }>(
    `/api/account/addresses/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    options,
  );
}

/* -------------------------------------------------------------------------- */
/* Checkout and orders                                                         */
/* -------------------------------------------------------------------------- */

export function fetchQuote(
  input: QuoteInput,
  options?: RequestOptions,
): Promise<ApiResult<PricedCart>> {
  return post<PricedCart>("/api/checkout/quote", input, options);
}

export function placeOrder(
  input: PlaceOrderFormInput,
  options?: RequestOptions,
): Promise<ApiResult<PlacedOrderReceipt>> {
  return post<PlacedOrderReceipt>("/api/orders", input, options);
}

export function trackOrder(
  input: TrackOrderInput,
  options?: RequestOptions,
): Promise<ApiResult<TrackedOrder>> {
  return post<TrackedOrder>("/api/orders/track", input, options);
}

export function fetchCouponOffers(
  subtotal: number,
  options?: RequestOptions,
): Promise<ApiResult<CouponOffer[]>> {
  const query = new URLSearchParams({ subtotal: String(subtotal) }).toString();
  return get<CouponOffer[]>(`/api/coupons?${query}`, options);
}
