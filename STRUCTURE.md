# TanhaApp Architecture

This document outlines the feature-based architecture of the TanhaApp Next.js project. The goal of this architecture is to create a scalable, maintainable, and well-organized codebase.

## Top-Level Folders

-   **/src/app**: Contains the Next.js App Router pages and API routes.
    -   **/src/app/api**: Houses all API route handlers, which are designed to be thin controllers that delegate business logic to service modules.
    -   **/src/app/(auth)**: Route group for authentication pages (login, signup).
    -   **/src/app/(features)**: Route group for feature-specific pages (e.g., todo, notes).
-   **/src/features**: This is the core of the application, where each feature is organized as a separate module.
    -   **/{feature}/components**: React components specific to a particular feature.
    -   **/{feature}/hooks**: Custom React hooks for managing feature-specific state and logic.
    -   **/{feature}/server**: Server-side logic, including services and repositories.
    -   **/{feature}/*.schema.ts**: Zod schemas for validating API inputs.
    -   **/{feature}/*.types.ts**: TypeScript types for the feature.
-   **/src/shared**: Contains modules that are shared across multiple features.
    -   **/src/shared/hooks**: Reusable React hooks (e.g., `useClientOnly`).
    -   **/src/shared/lib**: Shared libraries and utility functions (e.g., Prisma client, crypto).
    -   **/src/shared/types**: Global TypeScript types.
    -   **/src/shared/ui**: Reusable UI components (e.g., `Button`, `Modal`).
-   **/prisma**: Contains the Prisma schema and migration files.

## Conventions

-   **Server vs. Client Components**: We follow Next.js 16 best practices, using server components for data-heavy parts of the application and client components only where interactivity is needed.
-   **Import Style**: We use the `@/` path alias to import modules from the `src` directory, avoiding deep relative imports.
-   **API Routes**: API routes in `/src/app/api` act as thin controllers. They are responsible for:
    1.  Validating input with Zod.
    2.  Calling feature service functions from `/src/features/{feature}/server/*`.
    3.  Returning typed `NextResponse`.
-   **Prisma Calls**: All Prisma calls are centralized in repository modules (e.g., `src/features/notes/server/notes.repository.ts`) to ensure reusability and a clean separation of concerns.

## How to Run the Project

1.  **Install dependencies**: `pnpm install`
2.  **Run migrations**: `pnpm prisma migrate dev`
3.  **Run the development server**: `pnpm dev`

## How to Update the Project

-   When adding a new feature, create a new folder under `/src/features` and follow the established structure.
-   When adding a new shared component or hook, place it in the appropriate `/src/shared` subdirectory.
-   Always use the provided shared components to maintain a consistent UI.
