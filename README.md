# Garden of Dreams

A brochure and lead-generation website for an events venue. Built with Next.js (App Router),
Tailwind CSS, Lucide icons, Prisma, and SQLite by default.

## Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide icons
- **Forms:** react-hook-form + zod (shared validation schema between client and API)
- **Backend:** Next.js Route Handlers (`src/app/api/**`) acting as the API layer
- **Database:** SQLite via Prisma by default; swap to PostgreSQL with one line (see below)
- **Email:** Resend integration with an automatic console-log fallback (no API key required to run)

## 1. Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- npm 9+

## 2. Install & configure

```bash
cd garden-of-dreams
npm install
cp .env.example .env
```

The defaults in `.env` work out of the box: a local SQLite file and mock email notifications
logged to the terminal. No external services are required to run the app.

## 3. Set up the database

```bash
npm run db:push    # creates prisma/dev.db and applies the schema
npm run db:seed     # seeds the 3 spaces + 2 sample bookings used by the availability checker
```

Run `npm run db:studio` any time to browse/edit data in Prisma Studio.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Build for production

```bash
npm run build
npm run start
```

## Switching to PostgreSQL

1. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Run `npm run db:push` (or `npx prisma migrate dev` if you want tracked migrations).

## Enabling real email notifications

Add a `RESEND_API_KEY` from [resend.com](https://resend.com) to `.env`, along with
`VENUE_MANAGER_EMAIL` (who receives the lead) and `NOTIFICATIONS_FROM_EMAIL` (a verified sending
address). Leave `RESEND_API_KEY` blank to keep the console-log mock — inquiries still save to the
database either way.

## Project structure

```
src/
  app/
    page.tsx                    # composes all landing page sections
    layout.tsx                  # fonts + global metadata
    globals.css                 # design tokens, base styles, component classes
    api/
      inquiries/route.ts        # POST /api/inquiries
      availability/route.ts     # GET  /api/availability
  components/                   # Header, Hero, SpacesSection, Amenities, Pricing,
                                 # Testimonials, SocialProof, InquiryForm, Footer, ToastProvider
  lib/
    prisma.ts                   # Prisma client singleton
    validation.ts                # shared zod schema (client + server)
    email.ts                    # Resend / mock email notification helper
    content.ts                  # spaces, packages, amenities, testimonials copy
prisma/
  schema.prisma                 # Space, Inquiry, Booking models
  seed.js                       # seeds spaces + sample bookings
```

## API reference

### `POST /api/inquiries`

Validates and saves a booking inquiry, then notifies the venue manager.

**Body:**
```json
{
  "name": "Andrea Reyes",
  "email": "andrea@email.com",
  "phone": "+63 917 000 0000",
  "eventType": "WEDDING",
  "eventDate": "2027-02-14",
  "guestCount": 120,
  "spaceId": "cksp...",
  "notes": "Looking for an afternoon ceremony."
}
```

- `eventType` must be one of `WEDDING`, `GALA`, `BIRTHDAY`, `CORPORATE`.
- `eventDate` must be today or later.
- `guestCount` must be a positive integer.
- `spaceId` is optional (leave blank for "no preference"); when present it must match a `Space.id`
  from the database — fetch real IDs via Prisma Studio or by rendering the `<select>` in
  `InquiryForm.tsx`, which is already wired to the seeded spaces.

**Responses:**
- `201` → `{ ok: true, inquiryId, notification: "mock" | "resend" }`
- `422` → `{ ok: false, message, fieldErrors }` — validation failed
- `500` → `{ ok: false, message }` — server/database error

### `GET /api/availability?date=YYYY-MM-DD`

Returns `AVAILABLE`, `TENTATIVE`, or `BOOKED` for a given date, checked against the `Booking`
table. Optionally pass `&spaceId=...` to scope the check to one space.

**Response:**
```json
{ "ok": true, "date": "2026-10-04", "status": "AVAILABLE", "spaces": [] }
```

## Notes on the "Download Brochure" button

The hero CTA links to `/garden-of-dreams-brochure.pdf`. Drop your actual PDF brochure into the
`public/` folder with that filename to make the download live.

## Design system

Palette, type, and layout choices are documented as Tailwind tokens in `tailwind.config.ts`
(sage green, champagne gold, warm parchment) and `src/app/globals.css` (component classes like
`.btn-primary`, `.field-input`). Fonts are Fraunces (display/serif) and Public Sans (body/UI),
loaded via `next/font/google` in `src/app/layout.tsx`.
