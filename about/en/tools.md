# Productivity Tools Documentation

TanhaApp offers a suite of utility tools designed to enhance daily productivity.

## 1. Messenger
A system for sending and managing text messages.
- **API**: Uses `/api/massage` for CRUD operations (Create, Read, Delete).
- **Features**: Form validation, single and bulk message deletion, list animations.

## 2. To-Do List
Management of daily tasks with completion marking.
- **Authentication**: Requires the user to be logged in.
- **Technology**: Utilizes Prisma for storing tasks in the database.
- **Features**: Task editing, filtering remaining tasks, confirmation modals.

## 3. Notes
A private space for recording personal notes.
- **Structure**: Each note consists of a title, content, and creation timestamp.
- **Security**: Notes are user-specific and protected via JWT.

## 4. Prices Table
Real-time display of gold, currency, and cryptocurrency prices.
- **Data Source**: Fetches data from an external API (`brsapi.ir`).
- **Capabilities**: Quick search, categorization by asset type, display of percentage changes.

## 5. Data Repository
A treasury for storing mathematical formulas and scientific data.
- **Special Feature**: Supports **LaTeX** format for beautiful mathematical rendering using `react-katex`.
- **Management**: Allows defining custom categories and subcategories.

## 6. Calculator
Includes basic calculator, advanced calculator, and unit converter.
- **Advanced Calculator**: Uses the `mathjs` library for complex scientific calculations.
- **Unit Converter**: Converts various units (length, weight, temperature, etc.) using custom logic in `src/lib/converter.ts`.
