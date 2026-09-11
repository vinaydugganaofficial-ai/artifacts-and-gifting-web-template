# Aaranya — Arts & Artifacts storefront

A production-shaped storefront template for handcrafted Indian brass, built on
**Next.js 16** (App Router, Turbopack), **React 19**, **Tailwind v4**, **Zustand**
and **Zod**.

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and AUTH_SECRET
npm run dev                  # http://localhost:3000
```

**Demo account** (seeded outside production, with three orders at different
stages): sign in with `+91 98200 11223`. With no SMS provider configured the
one-time code is returned in the API response and shown on the verify screen,
so the flow works end to end without one.

---

## Architecture

The app is layered, and each layer only knows about the one beneath it:

```text
app/                    Routes. Server Components read through the services.
  api/                  Route handlers — the same services, over HTTP.
components/             Presentational. Take props; never import data.
lib/services/           Business logic: search, pricing, auth, orders.
lib/repositories/       Data-access interfaces + in-memory implementations.
lib/auth/               Phone normalisation, one-time codes, sessions, guards.
lib/data/               The seed data ("source of record").
config/                 Theme tokens and site configuration.
proxy.ts                Fast signed-out gate on /account.
```

**Two entry points, one implementation.** Server Components call the service
layer directly (so pages stay statically prerendered), and route handlers call
the _same_ services for the browser. There is exactly one implementation of
every rule.

**Nothing in `components/` imports data.** Pages fetch and pass props down. That
keeps every component pure, independently testable, and reusable with content
from a CMS.

**The catalog never reaches the browser.** `lib/data`, `lib/repositories` and
`lib/services` are all marked `server-only`, so importing them from a Client
Component is a compile error rather than a silent bundle-size regression. The
cart, wishlist, quick-view and search hold _ids_ and ask the API for the rest.

### Swapping the data source

`lib/repositories/index.ts` is the composition root — the only file that names a
concrete implementation. Point it at a database- or CMS-backed class that
satisfies the interfaces in `lib/repositories/types.ts` and nothing above it
changes.

---

## Theme configuration

`config/theme.ts` is the canonical source for colours, typography, motion,
layout and stacking order. Tailwind v4 needs its tokens declared statically in
CSS, so `app/globals.css` mirrors the palette and z-index scale.

That duplication is guarded: **`npm run check:theme`** parses both files and
fails if they disagree. Change `config/theme.ts` first, then mirror it.

```ts
import { palette, tokens, layout, easing } from "@/config/theme";
```

`config/site.ts` holds identity, navigation, footer columns, contact details and
commerce defaults (currency, quantity caps, featured count).

---

## The API

All responses share one envelope, discriminated on `ok`:

```jsonc
{ "ok": true,  "data": { … } }
{ "ok": false, "error": { "code": "bad_request", "message": "…", "fields": [ … ] } }
```

| Route                       | Method | Purpose                          |
| --------------------------- | ------ | -------------------------------- |
| `/api/products`             | GET    | Filter, sort, paginate           |
| `/api/products/[slug]`      | GET    | One product                      |
| `/api/products/by-id?ids=…` | GET    | Resolve ids from browser storage |
| `/api/collections`          | GET    | Collections with derived counts  |
| `/api/collections/[slug]`   | GET    | Collection + its products        |
| `/api/search?q=…`           | GET    | Ranked typeahead                 |
| `/api/newsletter`           | POST   | Sign-up                          |
| `/api/contact`              | POST   | Correspondence                   |
| `/api/orders`               | POST   | Order request                    |

`lib/api/client.ts` is the typed browser client. Every call resolves to an
`ApiResult` — network failures, timeouts and HTTP errors all become typed
failures, so a caller cannot forget to handle them.

## Accounts, checkout and orders

Authentication is **mobile number + one-time code**. There is no password, so
there is nothing to reuse, forget or leak.

Numbers are stored in **E.164**, so `98200 11223`, `+91 98200 11223` and
`0091-9820011223` all resolve to the same account. Signing in issues an **opaque
session id in an HttpOnly cookie**, signed with an HMAC and looked up in a
server-side store, so a session can be revoked instantly.

**How codes are protected** — every limit below is enforced in
`lib/services/auth.service.ts`, never in the UI:

| Control            | Value                                  | Why                                                                    |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------------- |
| Storage            | HMAC only, keyed with `AUTH_SECRET`    | A 6-digit space is trivially reversible from a plain hash              |
| Binding            | Digest includes the challenge id       | A code captured for one challenge cannot be replayed against another   |
| Comparison         | `timingSafeEqual`                      | Response timing reveals nothing about a partial match                  |
| Generation         | `randomInt` per digit                  | Every value is equally likely, leading zeros included                  |
| Expiry             | 5 minutes                              |                                                                        |
| Attempts           | 5, then the challenge burns            |                                                                        |
| Resend cooldown    | 30 seconds, server-side                | The on-screen timer is a mirror, not the control                       |
| Per-number ceiling | 5 per hour                             | Survives `x-forwarded-for` spoofing, which the per-IP limiter does not |
| Single use         | Consumed before the session is created | A replayed request cannot mint a second session                        |

Codes are delivered through `lib/services/sms.service.ts` — the one place a
provider is wired in. Without one, production **refuses to start the flow**
rather than silently sending nothing; `ALLOW_CONSOLE_OTP=true` lifts that for a
demo deployment.

`/account` covers the dashboard, order history, order detail with a status
timeline, an address book, account settings and coupons. `/track-order` is public
and needs the order number **and** the mobile number it was placed with.

Checkout is a real place-order flow — contact, delivery, payment method, review —
open to guests as well as members. **The client never sends money.** It submits
product ids, quantities and a coupon code; `priceCart()` recomputes every figure
from the catalog, and the same function produces both the on-screen quote and the
charged total, so the two cannot diverge.

### Security

- Every input validated with Zod, **on the server**, using the same schema the
  form uses. Client validation is a courtesy, never a control.
- **Orders are repriced server-side.** The client sends ids and quantities only,
  so a hand-edited `localStorage` cannot change what an order is worth. A signed-in
  customer's own email and saved addresses are read from the session, never the body.
- **Ownership is enforced in the service layer**, not the route, and a resource
  belonging to someone else returns the same "not found" as one that does not
  exist — so ids cannot be enumerated.
- **Account enumeration**: separate sign-in and sign-up flows necessarily reveal
  whether a number is registered. `auth.service.ts` documents how to collapse
  them into one flow if that matters for your threat model.
- **CSRF**: `SameSite=Lax` cookies plus an `Origin` check on every mutating route.
- Rate limiting on all write endpoints and on search (`lib/api/rate-limit.ts`).
  In-process by design — see the scaling note in that file before running more
  than one instance.
- Honeypot fields on every public form, answered with an indistinguishable
  success so a bot learns nothing.
- CSP, HSTS, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` set
  in `next.config.ts`; `x-powered-by` removed.
- Body size and content-type enforced before deserialisation.

### Observability

`lib/observability/logger.ts` emits one JSON object per line in production, with
sensitive keys redacted. `instrumentation.ts` hooks Next's `onRequestError` so
every server error is logged against the same `digest` the error page shows the
user — a report becomes a specific log line. Route handlers return that
correlation id as `x-request-id`.

---

## Scripts

| Script                    | Does                                       |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Development server                         |
| `npm run build`           | Production build                           |
| `npm run verify`          | **theme check → typecheck → lint → build** |
| `npm run typecheck`       | `tsc --noEmit`                             |
| `npm run lint`            | ESLint                                     |
| `npm run format`          | Prettier                                   |
| `npm run check:theme`     | Fails if theme tokens have drifted         |
| `npm run optimize:images` | Re-encode `public/images` PNGs to JPEG     |

---

## Notes for implementers

- **Policy and legal copy** in `lib/data/policies.ts` is illustrative template
  text, not legal advice. Replace it with policies reviewed for your
  jurisdiction before taking real orders.
- **Accounts, sessions and orders live in process memory.** They do not survive a
  restart and are not shared between instances. `lib/repositories/index.ts` is the
  one file to change — every consumer talks to the interfaces in
  `lib/repositories/types.ts`. (They are held on `globalThis` because Next compiles
  `proxy.ts`, `instrumentation.ts` and route handlers into separate bundles, each
  of which would otherwise get its own copy.)
- **No payment is taken.** Orders are placed, priced and recorded with a status
  history; `lib/services/submission.service.ts` and `order.service.ts` are the
  seams where an ESP, a ticketing inbox and a payment provider are wired in.
- **`AUTH_SECRET` is required in production** — the app refuses to start without
  it rather than signing sessions, and keying code digests, with a known
  development value.
- **Implement `sendOtpSms` before deploying.** Until then production refuses to
  issue codes at all.
- **The demo account is seeded outside production only.** Never set
  `SEED_DEMO_DATA=true` or `ALLOW_CONSOLE_OTP=true` on a live deployment: the
  first creates an account on a published number, the second reveals every code.
- **The CSP allows `'unsafe-inline'`** for scripts and styles, which Next's
  bootstrap and `next/font` currently require. Tightening to nonces needs a
  `proxy.ts`; do it before handling payments.
