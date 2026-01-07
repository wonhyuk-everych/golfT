## FEATURE:

Nuxt3 Golf Reservation System — Project Analysis (Architecture, Domains, Auth, i18n, DB Models, Data Flow)

Purpose: Provide a grounded, code-referenced analysis to guide onboarding, planning, and safe changes. This follows the context-engineering-intro INITIAL.md format while delivering a full project analysis.

## EXAMPLES:

- Project Structure (key directories)
  - `nuxt.config.ts` — HTTPS dev config, modules, runtimeConfig, i18n plugin path
  - `server/api/` — backend routes grouped by domain
  - `pages/` — UI routes grouped by domain
  - `plugins/` — i18n, Toss Payments, v-calendar
  - `middleware/auth.ts` — route guards, role checks
  - `composables/useAuthSession.ts` — client session state
  - `server/utils/db.ts` — MySQL pool

- Core Domains and Routes
  - Golf Course
    - List/create/update/delete: `server/api/golf-course/index.ts`
    - Detail: `server/api/golf-course/[id].ts`
      - Reads i18n cookie (`user-locale` or `i18n_redirected`) to fetch `locale_text`
      - Joins: `golf_course_image`, `locale_text`, review aggregates, min price, facilities
      - Wish check uses user session (`useUserSession`/`getUserSession`)
  - Hotel
    - Detail: `server/api/hotel/[id].ts`
      - Locale-aware `locale_text` joins: long_text blocks for explain/tour/transportation/language/room_type/room_facility/extra_charge/caution
      - Images, facilities split into H (hotel), R (room), E (extra) types; paid services
      - Wish check via session
  - Caddy
    - Detail: `server/api/caddy/[id].ts`
      - Locale-aware fields (language, specialty), review aggregates, images, wish check

- Authentication and Session
  - Endpoints:
    - `server/api/auth/login.post.ts` — member table login; `setUserSession`
    - `server/api/auth/check-session.get.ts` — returns session + debug
    - `server/api/auth/logout.post.ts` — `clearUserSession`
    - Social callbacks: `kakao-callback.ts`, `google-callback.ts`, `naver-callback.ts` using `server/config/oauth.ts`
  - Client:
    - `composables/useAuthSession.ts` — `$fetch('/api/auth/check-session')`, sets `user`/`loggedIn`
    - `middleware/auth.ts` — protects `/admin/*` (role `A`) and `/profile`, redirects if not logged in

- Internationalization (i18n)
  - Module: `@nuxtjs/i18n` with `vueI18n: './plugins/i18n.ts'` in `nuxt.config.ts`
  - Plugin: `plugins/i18n.ts` loads `locales/en/index.json` and `locales/ko/index.json`, default `ko`
  - Cookie persistence: reads `i18n_redirected` (and `user-locale` fallback) server-side in many APIs
  - Memory note: cookie name is `i18n_redirected`; persists across refreshes

- Database and Models
  - MySQL (mysql2/promise) via `server/utils/db.ts` with connection pool
  - SQL-heavy endpoints for public/customer flows
  - Admin API example uses Prisma (e.g., `server/api/admin/courses/[id].ts`) though no `schema.prisma` exists in repo

- Payment and Reservations
  - Validate/Create Order: `server/api/payment/check.ts`
    - Validates dates, product availability, prices; sums final amount
    - Stores request + generated `orderId` in Nitro storage: `useStorage('paymentSession').setItem('session:orderId', ...)`
  - Complete Payment: `server/api/payment/complete.ts`
    - Requires logged-in session
    - Verifies with Toss Payments API (test secret) and `orderId`
    - Transactionally inserts into:
      - `reservation_master`, `reservation_golf`, `reservation_hotel`, `reservation_callvan`, `reservation_caddy`, `reservation_tournament`
      - Marks shopping cart items `use_yn = 'N'`
      - Uploads tournament images via `utils/ftpUtils.ts`
  - Reservations Listing: `server/api/reservation/index.ts` — per type (G/H/C/V/T), paginated, localized labels

- Config and Runtime
  - `nuxt.config.ts`:
    - HTTPS dev server using local certs in `certs/`
    - Modules: `@nuxtjs/tailwindcss`, `nuxt-auth-utils`, `@nuxtjs/device`, `@nuxt/eslint`, `@nuxtjs/i18n`
    - Runtime `public`: `apiBase`, `tossPaymentsClientKey`
    - `script`: Kakao JS SDK
  - Plugins:
    - `plugins/toss-payments.client.ts` injects Toss client via `loadTossPayments(clientKey)` from runtime config

- Minimal Flow Examples
  - Golf course detail fetch:
    - Client hits `/api/golf-course/:id`
    - Server reads `i18n_redirected` to choose locale, queries images/locale_text/reviews/min price/facilities, merges wish state using session
  - Payment happy path:
    - Client submits basket to `/api/payment/check` → returns `orderId`
    - Toss payment completes → client posts to `/api/payment/complete` with `orderId`+`paymentKey`
    - Server verifies Toss, inserts reservations in one transaction, clears shopping cart items

## DOCUMENTATION:

- Internal Code References
  - Nuxt config: `nuxt.config.ts`
  - i18n: `plugins/i18n.ts`, `locales/en/index.json`, `locales/ko/index.json`
  - Auth: `server/api/auth/*.ts`, `middleware/auth.ts`, `composables/useAuthSession.ts`, `server/config/oauth.ts`
  - DB: `server/utils/db.ts`, raw SQL within `server/api/**`
  - Payments: `server/api/payment/check.ts`, `server/api/payment/complete.ts`
  - Reservations: `server/api/reservation/index.ts`
  - Domains: `server/api/golf-course/**`, `server/api/hotel/**`, `server/api/caddy/**`

- External Docs
  - Nuxt 3: https://nuxt.com/docs
  - @nuxtjs/i18n: https://i18n.nuxtjs.org/
  - vue-i18n: https://vue-i18n.intlify.dev/
  - nuxt-auth-utils (sessions): https://github.com/Atinux/nuxt-auth-utils
  - Toss Payments: https://docs.tosspayments.com/
  - mysql2: https://github.com/sidorares/node-mysql2

## OTHER CONSIDERATIONS:

- Security and Secrets
  - Hardcoded credentials and secrets detected:
    - MySQL in `server/utils/db.ts`
    - OAuth client IDs/secrets in `server/config/oauth.ts`
    - Toss test secret in `server/api/payment/complete.ts`
  - Recommendation: move to environment variables (`runtimeConfig`/server `process.env`) and secret management; avoid committing secrets.

- Session and Auth
  - Session is required for payment completion, wish checks, admin access
  - `middleware/auth.ts` enforces:
    - `/admin/*` → role `A`
    - `/profile` → logged-in
    - Elsewhere: redirect if not logged-in (verify this logic vs public pages)

- i18n Behavior
  - Cookie `i18n_redirected` persists language; server-side APIs often read it (or `user-locale`) to return localized text from `locale_text`
  - Ensure consistency in using one cookie key across all endpoints; consider normalizing to `i18n_redirected`

- Database Access
  - Public endpoints use raw SQL with `mysql2` and pooled connections
  - Admin endpoint(s) use Prisma but no local `schema.prisma` is found; align ORM usage or standardize on one approach
  - Significant domain tables implied: `golf_course`, `hotel`, `caddy`, `reservation_*`, `shopping_cart_*`, `locale_text`, `review`, etc.

- Transactional Integrity
  - Payment completion wraps multi-domain inserts in a single DB transaction
  - Error → rollback preserves consistency

- Files/Uploads
  - Tournament application images uploaded via FTP (`utils/ftpUtils.ts`)
  - Validate file size/types and sanitize handling in production

- Observability
  - Many APIs log verbose payloads; reduce PII logging in production
  - Add structured error responses and metrics where needed

- Next Steps / PRP Candidates
  - Externalize secrets into env/runtime config
  - Standardize i18n cookie key and server reading
  - Document DB schema (ERD) and add migrations (consider Prisma or SQL migrations)
  - Add unit/integration tests for payment validation and completion flows
  - Harden input validation using `zod` (present in dependencies) across APIs
