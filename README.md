# Horizoncraft

Horizoncraft is a full-stack storytelling platform built around a fictional universe created by my stepson. I designed and developed the project to turn his characters, powers, chapters, and drawings into an interactive digital experience.

The application combines a playful, comic-inspired public website with a secure content management system. It is also a portfolio project that demonstrates product thinking, UI design, responsive development, backend integration, authentication, data modeling, security, performance optimization, and deployment.

The current product presents Horizoncraft as one continuous story composed of multiple chapters, with characters, powers, and artwork connected to the same universe.

## What the application includes

### Public experience

- Responsive landing page with animated hero content
- Chapter directory and block-based chapter reader
- Character directory with individual profile pages
- Reusable power catalog connected to characters
- Drawing gallery with image previews and lightbox navigation
- Friendly URLs, metadata, loading states, error pages, and empty states
- Mobile navigation for both the public website and admin panel

### Content management

- Private administrator login with no public registration flow
- Create, edit, reorder, publish, and delete chapters
- Create and manage characters and their powers
- Reusable power creation with duplicate-name validation
- Drawing uploads with client-side preview and automatic WebP conversion
- Draft and published states for controlled content visibility
- Responsive admin interface with feedback, confirmation dialogs, and loading states

## Engineering highlights

- Full-stack architecture with Next.js App Router and React Server Components
- Server Actions with Zod validation for administrative operations
- PostgreSQL relational model for stories, chapters, characters, powers, and artwork
- Row Level Security policies protecting drafts and administrative operations
- Private Supabase Storage bucket with access based on published content
- Cached public queries with immediate tag invalidation after admin changes
- Batched signed Storage URLs to reduce network round trips
- Responsive image sizing, LCP prioritization, long-lived image caching, and font subsetting
- Local demo data when Supabase environment variables are not configured

## Tech stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) and custom CSS
- [Supabase](https://supabase.com/) for PostgreSQL, Auth, and Storage
- [Zod](https://zod.dev/) for runtime validation
- [Vitest](https://vitest.dev/) for automated tests
- [Vercel](https://vercel.com/) for deployment

## Getting started

Requirements:

- Node.js 22 or a compatible active LTS release
- npm

Install the dependencies and create the local environment file:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase credentials, the public website uses local demo data. The admin area requires a configured Supabase project.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Only the public Supabase URL and anonymous key are required. A `service_role` key must never be exposed through a `NEXT_PUBLIC_` variable or committed to the repository.

## Supabase setup

Create a Supabase project, authenticate the CLI, link the repository, and apply the committed migrations:

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

The migrations create:

- the relational content model and supporting indexes;
- Row Level Security policies;
- helper functions and update triggers;
- the private `media` Storage bucket;
- initial content used by the project.

### Create an administrator

Public account creation is intentionally unavailable.

1. In Supabase, open **Authentication → Users** and create a user.
2. Copy the generated user UUID.
3. Run the following statement in the SQL Editor:

```sql
update public.profiles
set is_admin = true,
    display_name = 'Admin'
where id = 'USER_UUID';
```

The administrator can then sign in at `/admin/login`.

## Data and security model

The main tables are:

- `profiles`
- `stories`
- `chapters`
- `characters`
- `powers`
- `character_powers`
- `gallery_items`

All exposed tables use Row Level Security. Anonymous visitors can only read published content, while administrative writes require an authenticated user whose profile is marked as an administrator.

Chapter content is stored as a validated list of JSON blocks, including paragraphs, headings, quotes, lists, and images. The reader maps these blocks to React components instead of executing user-provided HTML.

Images are uploaded to a private Storage bucket. The admin interface validates file type and size, resizes large images, converts them to WebP, and generates unique file paths. Public access is limited to media connected to published content.

## Available scripts

```bash
npm run dev          # Start the development server
npm run build        # Create a production build
npm run start        # Run the production server
npm run lint         # Run ESLint
npm run typecheck    # Validate TypeScript types
npm test             # Run the test suite
npm run format:check # Check formatting
```

## Project structure

```text
app/                  Public pages, chapter reader, and admin routes
components/           Shared public and administrative components
lib/                  Data access, validation, types, and Supabase clients
supabase/migrations/  Database schema, policies, and incremental changes
tests/                Automated tests
```

## Deployment

The application is prepared for deployment on Vercel:

1. Import the GitHub repository into Vercel.
2. Add the three public environment variables.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
4. Deploy the application.

Local development and Vercel can use the same Supabase project. Changes made through either application will update the same database and Storage bucket.

## Project status

Horizoncraft is an actively developed personal project. The current version provides a complete public content experience and a focused private CMS, while leaving room for future chapters, characters, artwork, and carefully scoped editorial features.
