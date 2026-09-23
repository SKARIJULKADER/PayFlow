# PayFlow — frontend

A modern, Paytm-inspired digital wallet UI built with **React + Vite + Tailwind CSS v4**.
It talks to the existing Express/Mongo backend in `../backend` **without changing a single
backend file or route**.

## Run it

```bash
# terminal 1 — the existing backend (API on http://localhost:3000)
cd ../backend && node index.js

# terminal 2 — PayFlow
npm install
npm run dev      # http://localhost:5173
```

In development every `/api/*` request is proxied to `http://localhost:3000` (see
`vite.config.js`), so the browser never leaves the origin and no CORS preflight is needed.

For a deployed build, set the API base explicitly:

```bash
echo "VITE_API_URL=https://your-api.example.com/api/v1" > .env
npm run build
```

## Backend endpoints used (unchanged)

| Screen | Method & path | Body / headers | Response |
| --- | --- | --- | --- |
| Signup | `POST /api/v1/user/signup` | `{ firstName, lastName, username, password }` | `{ message, token }` |
| Dashboard / Send / Profile | `GET /api/v1/account/balance` | `Authorization: Bearer <jwt>` | `{ balance }` |
| Send Money | `POST /api/v1/account/transfer` | `Authorization: Bearer <jwt>`, `{ to, amount }` | `{ message }`, or `400 { message }` (`Insufficient balance`, `Invalid account`) |

A missing/expired token returns `403 {}` — the client treats that as a signed-out session,
clears the stored token and routes back to `/signup`.

## Notes & constraints

- The backend has **no `/signin`, no `/me` and no transaction history** endpoint. PayFlow therefore
  caches the profile typed at signup plus the JWT in `localStorage`, reads the user id out of the
  token payload, and keeps a small device-local list of successful transfers for the dashboard's
  “Recent activity” section (which shows a proper empty state until then).
- Transfers are validated client-side first (24-character user id, positive amount, sufficient
  balance, no self-transfers) so users get instant, readable errors.
- UI kit: custom toasts, skeleton shimmer loaders, animated success check, modal confirmation,
  page transitions, hide/show balance, copy-to-clipboard PayFlow ID. Only `react`,
  `react-dom`, `react-router-dom` and `prop-types` are runtime dependencies.

## Scripts

```bash
npm run dev      # dev server with API proxy
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint     # eslint (react + react-hooks rules, zero warnings allowed)
```

