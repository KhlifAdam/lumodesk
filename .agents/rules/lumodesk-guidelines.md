# Agent Guidelines & Tech Stack

This file contains the core technical rules and architecture for **Lumodesk** (the PFE Photography/Audiovisual platform). As an AI Agent, I will automatically load and follow these instructions for every task in this project. 
*(For detailed product features and business logic, refer to `PRD.md` on demand).*

## 1. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (with `next-themes` for Light/Dark mode)
- **Database:** PostgreSQL (running locally via Docker)
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Media Storage:** Cloudflare (Cloudflare R2 for S3-compatible storage)
- **Internationalization (i18n):** `next-intl` (for multi-language support)

## 2. Coding Rules & Conventions
- **Keep Files Short:** Source code files should be a **maximum of 200 lines**. 
- *Exception:* You may exceed this slightly only if splitting the file into smaller pieces would make the code significantly messier or harder to read.
- **Modularity:** Extract reusable UI components into the `components/` directory, and extract complex business logic/database calls into the `services/` or `lib/` directories.
- **Language:** Use strict TypeScript for all files.
- **Strict i18n:** NEVER hardcode user-facing text in the components. Always use `next-intl` for translations. The app supports English (`en`) and French (`fr`) for now. Every UI string must be localized from day one.

## 3. Recommended Folder Structure
We will follow this structure as we initialize the Next.js project:

```text
/
├── PRD.md                   # Product Requirements Document
├── docker-compose.yml       # PostgreSQL database container definition
├── messages/                # i18n translation dictionaries (en.json, fr.json)
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   │   ├── [locale]/        # Dynamic route segment for i18n (en/fr)
│   │   │   ├── (public)/    # Public-facing site (Portfolio, Booking)
│   │   │   └── (dashboard)/ # Private CRM/Management space
│   │   └── api/             # API Routes (Webhooks, better-auth, AI endpoints)
│   ├── components/          # Reusable React components
│   │   ├── ui/              # shadcn/ui generated components
│   │   └── shared/          # Custom shared components
│   ├── lib/                 # Core configs (Prisma client, Better Auth setup)
│   ├── services/            # Business logic (Project management, media)
│   └── types/               # Global TypeScript definitions
└── package.json
```

## 4. Agent Behavior Workflow
- Always verify if a `docker-compose.yml` is running before attempting database migrations.
- When starting a brand new, large feature, I must use my tools to read `PRD.md` to ensure I respect the exact specifications of the project.

## 5. Multi-Tenant Architecture & Security
- **Data Isolation:** This is a SaaS application. Every Prisma query in the private/dashboard space MUST include a tenant check (e.g., `where: { photographerId: session.user.id }` or equivalent) to prevent data leakage between different photographers' workspaces.
- **Role-Based Access Control (RBAC):** Always respect the roles defined in the PRD (Admin, Photographe, Client, Equipe) when handling data access, server actions, and UI rendering.

## 6. Next.js 16 & React 19 Standards
- **App Router & Server Components:** Use the App Router (`app/`). Default to React Server Components (RSC). Only use `"use client"` when interactivity, React hooks, or browser APIs are required.
- **Server Actions:** Use Server Actions for all data mutations instead of traditional API routes (`/api`), ensuring they are type-safe and validated.
- **Route Groups:** Strictly separate the public marketing/portfolio sites (e.g., `app/(public)`) from the SaaS CRM dashboard (`app/(dashboard)`).

## 7. Data Validation
- **Zod:** Use `zod` for ALL data validation. This includes validating form inputs on the client, parsing Server Action payloads on the server, and validating environment variables. Never trust client input without Zod validation.

## 8. Authentication
- **better-auth:** Use `better-auth` for authentication. Follow its specific Next.js App Router patterns to fetch the session securely on both the server and the client.

## 9. UI/UX & Styling
- **Tailwind CSS v4:** Follow Tailwind v4 conventions for styling.
- **Rich Aesthetics:** Implement premium, modern designs. Favor glassmorphism, sleek dark modes, subtle micro-animations, and curated color palettes. The UI should look highly professional and "wow" the user. Do not settle for basic MVPs.
- **Icons:** Exclusively use `lucide-react` for icons to maintain consistency.

## 10. Prisma ORM v7
- **Naming Conventions (Snake Case):** All database tables and columns MUST use `snake_case` in the actual PostgreSQL database (e.g., `user_profiles`, `created_at`). However, in the Prisma Client (TypeScript code), they should remain `camelCase`. You must achieve this by using Prisma's `@@map("table_name")` for models and `@map("column_name")` for fields.
- Ensure schema relationships strictly follow the domain models outlined in the PRD (e.g., Projects, Bookings, Clients, Media, Material).
- Follow the guidelines in the `prisma-upgrade-v7` and `prisma-client-api` skills when writing queries or updating the database.

## 11. Caching & Data Fetching
- **Server Components Default:** For 95% of data fetching, use React Server Components (RSC). Next.js automatically caches and deduplicates these requests natively.
- **Cache Invalidation:** Use Server Actions combined with `revalidatePath` or `revalidateTag` to mutate data and instantly update the UI.
- **Client Fetching (SWR):** Only use `swr` (or React Query) when strictly necessary for client-side interactions, such as live polling, infinite scrolling, or real-time dashboard widgets. It should *not* be the default method for loading a page's initial data.

## 12. Dashboard Performance (Streaming & Suspense)
- **Do not avoid SSR for the Dashboard:** The dashboard *should* use Server Components (SSR) because it allows us to securely fetch data directly from Prisma without exposing APIs.
- **Use Suspense:** To ensure the dashboard feels instantaneous (like a traditional SPA), always use `loading.tsx` and `<Suspense>` boundaries. Stream the UI shell (sidebar, header) immediately to the user while the server fetches the private data in the background.

## 13. Form Handling
- **React Hook Form:** For all client-side form interactions (e.g., creating a booking, updating settings), use `react-hook-form` paired with `@hookform/resolvers/zod`.
- **Integration with shadcn/ui:** Rely on the `shadcn/ui` `<Form>` components, which internally use `react-hook-form`, to provide accessible, validated, and beautifully styled form fields.
- **Server Actions:** Once the form is validated on the client by `react-hook-form`, submit the sanitized data to a Server Action for actual database mutation.

## 14. Design System & Theming (Single Source of Truth)
- **Do not scatter utility classes:** Do not use arbitrary or scattered utility classes for core design elements (like `rounded-3xl`, hardcoded padding, or specific hex colors) directly on individual pages or components.
- **Update Shadcn / globals.css:** If we want to change the border radius, base padding, or colors for the entire app, we must update the CSS variables in the global CSS file (`globals.css`) or directly modify the specific component file inside `components/ui/`. 
- **Consistency:** By keeping `shadcn/ui` and our global CSS as the single source of truth, the application will naturally maintain the cohesive, premium "Rich Aesthetics" theme everywhere.

## 15. Translation Files Organization (next-intl)
- **File Location:** Translation files must be strictly named `en.json` and `fr.json` and placed inside the `/messages/` directory at the root of the project.
- **Hierarchical Structure:** Do not use flat keys (like `"hello": "Bonjour"`). Group translations hierarchically by Feature, Page, or Component to avoid naming collisions and keep files maintainable.
  - *Example:* 
    ```json
    {
      "Auth": {
        "loginButton": "Se connecter",
        "errors": { "invalidEmail": "Email invalide" }
      },
      "Dashboard": { "title": "Tableau de Bord" }
    }
    ```
- **Usage:** In components, use the namespace to fetch the relevant string: `const t = useTranslations('Auth'); t('loginButton');`

## 16. File Naming Conventions
- **Kebab Case Everything:** To maintain strict consistency with `shadcn/ui` (which generates files like `alert-dialog.tsx`), ALL files across the entire project MUST be named in `kebab-case`.
- **Examples:**
  - Components: `user-profile-card.tsx` (Not `UserProfileCard.tsx`)
  - Services: `booking-service.ts` (Not `bookingService.ts`)
  - Utilities: `date-formatter.ts`
- **Next.js Reserved Files:** Next.js App Router files must follow their exact reserved names (`page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`).

## 17. Tooling & Formatting (pnpm & Biome)
- **Package Manager:** The project exclusively uses `pnpm`. Do not use `npm` or `yarn` commands to avoid generating conflicting lockfiles.
- **Formatter:** We use **Biome** (`@biomejs/biome`) as our extremely fast formatter and linter. 
- **Workflow:** Always ensure your code is formatted. You can run `pnpm format` (which executes `biome format --write .`) to instantly format all files according to our standard.
