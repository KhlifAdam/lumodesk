# Agent Guidelines & Tech Stack

This file contains the strict technical rules and architecture for **Lumodesk** (the PFE platform). As an AI Agent, I MUST automatically load and follow these instructions for every task. *(For business logic, refer to `PRD.md`).*

## 1. Core Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui + next-themes
- **Database / ORM:** PostgreSQL (Docker) + Prisma v7
- **Authentication:** Better Auth
- **Media Storage:** Cloudflare R2
- **i18n:** `next-intl` (en/fr)

## 2. Coding Rules & Folder Structure
- **Keep Files Short:** Source files MUST be a **maximum of 200 lines**. *Exception:* Only exceed this if splitting makes the code significantly harder to read.
- **Modularity:** Extract reusable UI into `components/` and business logic into `services/` or `lib/`.
- **Language:** Use strict TypeScript.
- **Strict i18n:** NEVER hardcode user-facing text. Always use `next-intl`. Every UI string MUST be localized from day one.
- **Pre-flight:** Always verify `docker-compose.yml` is running before DB migrations. Consult `PRD.md` before starting massive features.

## 3. Multi-Tenant Architecture & Security
- **Data Isolation:** Every Prisma query in the private space MUST include a tenant check (e.g., `where: { photographerId: session.user.id }`) to prevent data leakage.
- **Role-Based Access Control (RBAC):** Strictly respect PRD roles (Admin, Photographe, Client, Equipe) for data access, Server Actions, and UI.

## 4. Next.js 16 Standards (App Router)
- **Server Components:** Default to React Server Components (RSC). Only use `"use client"` when interactivity or React hooks are required.
- **Server Actions:** Use Server Actions for ALL data mutations instead of `/api` routes to ensure type-safety.
- **Route Groups:** Strictly separate `app/(public)` (Marketing) from `app/(dashboard)` (CRM).

## 5. Data Validation & Authentication
- **Zod:** Use `zod` for ALL validation (client forms, Server Action payloads, env vars). NEVER trust client input without Zod.
- **better-auth:** Follow specific App Router patterns to securely fetch sessions on both server and client.

## 6. Prisma ORM v7
- **Strict Naming Conventions:** Database tables/columns MUST use `snake_case` (e.g., `user_profiles`). Prisma Client TS code MUST use `camelCase` (enforced via `@@map("table_name")` and `@map("column_name")`).
- **Relationships:** Schema MUST strictly follow the domain models outlined in the PRD.

## 7. Caching, Fetching & Performance
- **Dashboard SSR:** The dashboard MUST use Server Components (SSR) to securely fetch data from Prisma without exposing APIs.
- **Suspense & Streaming:** Always use `loading.tsx` and `<Suspense>` to stream the UI shell instantly while fetching private data.
- **Client Fetching:** Use `swr` ONLY for live polling/infinite scrolling. It must NOT be the default method.
- **Cache Invalidation:** Mutate via Server Actions + `revalidatePath` / `revalidateTag`.

## 8. Form Handling
- **React Hook Form:** For all client interactions, use `react-hook-form` paired with `@hookform/resolvers/zod`.
- **shadcn/ui:** Rely on the `shadcn/ui` `<Form>` components. Submit sanitized data to Server Actions.

## 9. UI/UX, Design System & Theming
- **Rich Aesthetics:** Implement premium designs. Favor glassmorphism, sleek dark modes, and curated palettes. Do not settle for basic MVPs.
- **Single Source of Truth:** NEVER scatter hardcoded padding, colors, or `rounded-3xl` utilities. Update CSS variables in `globals.css` or the specific `components/ui/` file to maintain a cohesive theme.
- **Icons:** Exclusively use `lucide-react`.

## 10. Translation Organization (next-intl)
- **File Location:** Strictly `en.json` and `fr.json` in `/messages/`.
- **Hierarchical Structure:** Group translations hierarchically by Feature or Component (e.g., `"Auth": { "loginButton": "Se connecter" }`). NEVER use flat keys.

## 11. Tooling, Formatting & Naming
- **Kebab Case Everything:** ALL files across the project MUST be named in `kebab-case.tsx` (e.g., `user-profile.tsx`), except Next.js reserved files.
- **Package Manager:** Exclusively use `pnpm`. NEVER use `npm` or `yarn`.
- **Formatter:** Use **Biome**. Run `pnpm format` routinely.

## 12. Animations & Interactions
- **Framer Motion:** Use for complex, fluid animations (scroll-reveals, layout transitions).
- **CSS Transitions:** Use standard Tailwind (`transition-all duration-300`) for simple hover states.
- **Aesthetic:** Keep animations smooth, subtle, and premium. NEVER overly bouncy.

## 13. Data Lists (Pagination & Filtering)
- **Always Paginate:** Any large data list (Clients, Invoices, Media) MUST implement pagination from day one. NEVER render massive unsorted arrays.
- **URL Search Params:** Store active filters, sort state, and current page in the URL (`?page=2&status=pending`) to keep UI in sync with the server.
