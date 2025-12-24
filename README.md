# Next.js + TailwindCSS Boilerplate (App Router)

Minimal, production-lean Next.js starter with:

- Next.js **16** (App Router) + React **19** + TypeScript
- TailwindCSS **4** + a small UI layer (shadcn/ui-style primitives live in this repo)
- Internationalization with `next-intl` (`en`, `tr`)
- Storybook **10** on **Webpack** (`@storybook/nextjs`)
- Jest + Testing Library

## Requirements

- Node.js 18+
- npm (or any package manager that can read `package-lock.json`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

```bash
# App
npm run dev
npm run build
npm run start

# Quality
npm run lint        # eslint ./src
npm run lint:fix    # eslint ./src --fix
npm run format      # prettier --write .

# Tests
npm run test

# Storybook
npm run storybook
npm run build-storybook
```

## Environment variables

Create a `.env` (or use `.env.example`) as needed.

- `API_URL` – Base URL used by the server-side fetch wrapper in `src/services/http/client.ts`.
- `NEXT_PUBLIC_URL` – Optional base URL used by the SEO helper (`src/shared/lib/seo.ts`).

## Project structure

```text
.
├─ src/
│  ├─ app/                 # Next.js App Router
│  │  ├─ [locale]/         # Locale segment (pages live here)
│  │  ├─ layout.tsx        # Root layout (providers + locale setup)
│  │  ├─ robots.ts         # robots.txt
│  │  └─ sitemap.ts        # sitemap.xml
│  ├─ features/            # Feature-oriented code (domain/grouped)
│  ├─ i18n/                # next-intl routing + request config
│  ├─ services/            # Cross-cutting services (http/auth/logger/storage)
│  ├─ shared/              # Shared utilities, UI, hooks, providers, layout
│  ├─ stories/             # Storybook stories & examples
│  └─ styles/              # globals.css, themes.css
├─ messages/               # i18n message catalogs (en.json, tr.json)
├─ __tests__/              # Jest tests
├─ .storybook/             # Storybook config
└─ storybook-static/       # Storybook build output (generated)
```

### Import alias

TypeScript path alias is configured as:

- `@/*` → `src/*`

## Internationalization (next-intl)

- Locales are defined in `src/i18n/routing.ts` (`en`, `tr`), default is `en`.
- Message files live under `messages/`.
- The Next.js integration is wired via `next.config.ts` using `next-intl/plugin`.

There is also a middleware implementation in `src/proxy.ts` (based on `next-intl/middleware`).
If you want automatic locale detection/redirects, rename it to `src/middleware.ts` (or `middleware.ts`) so Next.js picks it up.

## UI / styling

- Global styles: `src/styles/globals.css`
- Theme tokens: `src/styles/themes.css` (used by `next-themes`)
- UI primitives (Button, Dialog, etc.): `src/shared/ui/primitives/`
- Small React UI helpers (e.g. theme toggle): `src/shared/ui/react/`

Note: `components.json` exists for shadcn/ui tooling, but this repo’s current UI paths live under `src/shared/ui/*`.

## Services

- HTTP: `src/services/http/client.ts`
  - Uses `fetch` and supports request/response interceptors.
  - Adds `Authorization: Bearer <token>` if `getAccessToken()` returns a cookie token.
  - Uses `API_URL` when you call it with a relative URL.
- Auth token helpers: `src/services/auth/token.service.ts` (cookie-based)
- Logger: `src/services/logger/*` (Winston, console-oriented)
- Storage helpers:
  - `src/services/storage/local-storage.service.ts`
  - `src/services/storage/session-storage.service.ts`

## Storybook

Storybook is configured in `.storybook/` and uses Webpack via `@storybook/nextjs`.

```bash
npm run storybook
```

## Testing

- Jest config: `jest.config.ts` (via `next/jest`)
- Test setup: `jest.setup.ts`

```bash
npm run test
```

## License

MIT – see `LICENSE`.
