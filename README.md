# Whimsey Accessories

Premium tech accessories storefront for **Whimsey Technologies** — a full e-commerce experience with a customer shop, checkout, order tracking, and a production-ready admin panel.

Built for real retail ops in Kenya: delivery locations, WhatsApp handoff, inventory status, and clear order fulfillment states customers can track.

---

## Features

### Storefront
- Browse shop by category, search, sort, and price filters
- Deals page for promotional items
- Responsive product grids with pagination (24 products per page)
- Product detail pages with specs, stock status, and WhatsApp inquiry
- Cart + checkout (delivery or store pickup)
- Order tracking by Order ID + email (Received → Preparing → On transit → Delivered)

### Admin
- Secure admin login (NextAuth)
- Dashboard overview (orders, revenue, catalog, WhatsApp activity)
- Product & inventory management (create / edit / stock / deals)
- Orders & fulfillment (list, detail, status + payment updates, customer notes)
- Delivery locations and fees
- Customers, WhatsApp click log, and admin team management
- In-app notifications for new orders and staff activity
- Mobile-friendly admin shell with slide-out navigation

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Database | PostgreSQL (Prisma ORM) |
| Auth | NextAuth v5 |
| State | Zustand (cart) |
| Deploy target | Vercel-ready |

---

## Project structure (high level)

```text
app/
  (storefront routes)     # /, /shop, /deals, /cart, /checkout, /track-order, …
  admin/                  # Admin login + dashboard routes
  api/                    # REST handlers (orders, products, track, admin, …)
components/
  admin/                  # Admin UI
  product/                # Shop grids, filters, pagination
  track-order/            # Order tracking form
lib/                      # Prisma, products, orders, auth helpers
prisma/                   # Schema + seed
```

---

## Getting started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local or hosted, e.g. Supabase)

### 1. Install

```bash
npm install
```

### 2. Environment

Create a `.env` file in the project root with at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"

AUTH_SECRET="generate-a-long-random-secret"
# Local only — do NOT set this to localhost on Vercel
AUTH_URL="http://localhost:3000"
```

> Use `DIRECT_URL` for Prisma migrations when your primary `DATABASE_URL` goes through a pooler.

### Vercel / production auth (important)

If `AUTH_URL` or `NEXTAUTH_URL` is set to `http://localhost:3000` in Vercel, admin login and protected routes will redirect users to localhost.

On Vercel → Project → Settings → Environment Variables:

| Variable | Production value |
| --- | --- |
| `AUTH_SECRET` | A long random secret (required) |
| `AUTH_URL` | `https://whimsey-accessories-store.vercel.app` **or remove it** |
| `NEXTAUTH_URL` | Remove if present (legacy); do not leave as localhost |

`trustHost` is enabled in code, so omitting `AUTH_URL` on Vercel is fine — Auth.js will use the request host. After changing env vars, redeploy.

### 3. Database

```bash
npx prisma db push
npm run db:seed
```

### 4. Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin area: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:seed` | Seed products / baseline data |

---

## Order status (customer-facing)

Admin and Track Order share the same lifecycle:

| System status | Customer label |
| --- | --- |
| `PENDING` | Order received |
| `PROCESSING` | Preparing |
| `SHIPPED` | On transit |
| `COMPLETED` | Delivered |
| `CANCELLED` | Cancelled |

Payment is tracked separately (`PENDING` / `PAID` / `FAILED`).

---

## Deployment notes

1. Set the same environment variables in your host (e.g. Vercel).
2. Run `prisma generate` on install (`postinstall` is already configured).
3. Apply schema with `prisma db push` or migrations against production.
4. Deploy the Next.js app; no separate frontend server is required.

---

## Brand

**Whimsey Technologies** — premium hardware ecosystems engineered for elite digital setups.

- Email: whimseytech@gmail.com  
- WhatsApp: 0769591223  

---

## License

Private project for Whimsey Technologies. All rights reserved unless otherwise stated.
