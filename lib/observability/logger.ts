import "server-only";

/**
 * Structured server-side logging.
 *
 * Emits one JSON object per line in production so a log shipper (Datadog, Loki,
 * CloudWatch) can parse it without a custom grok pattern, and a readable line in
 * development. Never import this into a Client Component — use it in route
 * handlers, services and `instrumentation.ts`.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveMinLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL?.toLowerCase();
  if (configured && configured in LEVEL_WEIGHT) return configured as LogLevel;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const MIN_LEVEL = resolveMinLevel();

/** Keys whose values are replaced before a record is written. */
const REDACTED_KEYS = new Set([
  "authorization",
  "cookie",
  "email",
  "password",
  "phone",
  "secret",
  "token",
]);

const REDACTED = "[redacted]";
const MAX_DEPTH = 4;

/**
 * Recursively strips sensitive values. Personal data reaching a log aggregator
 * is a compliance problem, so redaction happens here rather than at each site.
 */
function redact(value: unknown, depth = 0): unknown {
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((entry) => redact(entry, depth + 1));
  }

  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    output[key] = REDACTED_KEYS.has(key.toLowerCase())
      ? REDACTED
      : redact(entry, depth + 1);
  }
  return output;
}

export type LogContext = Record<string, unknown>;

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[MIN_LEVEL]) return;

  const record = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? (redact(context) as LogContext) : {}),
  };

  const sink =
    level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (process.env.NODE_ENV === "production") {
    sink(JSON.stringify(record));
    return;
  }

  sink(`[${level}] ${message}`, context ? redact(context) : "");
}

export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};

/**
 * Correlation id for a single request, echoed to the client as `x-request-id`
 * so a user-reported failure can be matched to its server log line.
 */
export function createRequestId(): string {
  return globalThis.crypto.randomUUID();
}

/** Narrows an unknown thrown value into something loggable. */
export function toErrorContext(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      error: { name: error.name, message: error.message, stack: error.stack },
    };
  }
  return { error: { name: "UnknownError", message: String(error) } };
}
