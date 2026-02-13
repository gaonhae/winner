# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project with Prisma, NextAuth, and S3-based image uploads.
- `app/`: routes, pages, layouts, and API handlers (`app/api/**/route.ts`).
- `components/`: reusable UI components (for example `PostForm.tsx`, `Header.tsx`).
- `lib/actions/`: server actions; `lib/queries/`: read-only data queries.
- `lib/prisma.ts`, `lib/s3.ts`: infrastructure wiring for DB and uploads.
- `hooks/`: client hooks (for example `useImageUpload.ts`).
- `prisma/`: schema and migrations; generated client is in `generated/` (ignored).
- `public/`: static assets. `types/`: shared type augmentations.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run lint`: run ESLint (`eslint-config-next` + TypeScript rules).
- `npm run build`: production build validation.
- `npm run start`: run the built app.
- `npx prisma generate`: regenerate Prisma client after schema changes.
- `npx prisma migrate dev --name <name>`: create/apply a local migration.
- `docker compose up -d mysql`: run local MySQL only.

## Coding Style & Naming Conventions
- Use TypeScript with `strict` mode expectations; avoid `any` unless justified.
- Follow existing formatting: 2-space indentation, semicolons, double quotes.
- Use `@/*` path aliases for internal imports.
- Naming: components in PascalCase (`PostCard.tsx`), hooks in camelCase with `use` prefix (`useImageUpload.ts`).
- Keep route conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `route.ts`.
- Validate external input with `zod` in server actions/routes.

## Testing Guidelines
No automated test framework is configured yet. Before opening a PR, run:
- `npm run lint`
- `npm run build`

Also manually verify changed flows (auth, post create/edit/delete, image upload). If adding tests, prefer `*.test.ts(x)` naming and colocate near the feature or under a dedicated `__tests__/` folder.

## Commit & Pull Request Guidelines
Current history has a single bootstrap commit (`first commit`), so conventions are not yet established. Use:
- Conventional Commit style (`feat:`, `fix:`, `chore:`, `refactor:`) with imperative subjects.
- Focused PRs with: what changed, why, verification steps, migration notes, and screenshots for UI changes.
- Link related issues/tasks when available.

## Security & Configuration Tips
- Never commit `.env*` files or secrets.
- Keep upload constraints consistent between client (`hooks/useImageUpload.ts`) and server (`lib/s3.ts`).
- Required runtime config includes DB, Auth, AWS, and CloudFront environment variables.
