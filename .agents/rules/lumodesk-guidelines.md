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

