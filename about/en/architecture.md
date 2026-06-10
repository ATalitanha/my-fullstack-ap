# TanhaApp Architecture and Structure

This document provides an overview of the architecture and folder structure of the TanhaApp project.

## Folder Structure

- `/src`: Main source code of the application.
  - `/app`: Next.js routes (App Router). Each subfolder defines a page or an API route.
  - `/components`: Reusable React components.
  - `/constants`: Constants and application Contexts (e.g., LanguageContext).
  - `/dictionaries`: JSON files containing Persian (`fa.json`) and English (`en.json`) translations.
  - `/features`: Specific logic for different application features.
  - `/hooks`: Custom React hooks (e.g., `useTranslation`).
  - `/lib`: Utility functions and library configurations (e.g., Prisma, theme settings).
  - `/shared`: Common components and hooks shared across different parts.
  - `/types`: TypeScript definitions.
- `/prisma`: Database schema and Prisma migrations.
- `/public`: Static assets like images and fonts.
- `/docs`: Additional technical documentation.

## Technology Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Internationalization**: Custom implementation using React Context
- **Icons**: Lucide React & React Icons
- **Validation**: Zod (for APIs)

## Design Patterns

1. **Feature-based Architecture**: Code is organized by feature for better scalability and maintainability.
2. **Custom i18n Hook**: Using the `useTranslation` hook for easy access to translations in all client components.
3. **Responsive Design**: Utilizing Tailwind utilities to ensure proper display across all devices.
4. **Glassmorphism**: Using glass effects and blurs in UI design (Linear.app style).
