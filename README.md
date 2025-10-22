# TanhaApp

TanhaApp is a versatile, open-source web application built with Next.js and TypeScript, offering a suite of essential tools to enhance daily productivity. This project serves as a centralized hub for a variety of utilities, including a calculator, messenger, to-do list, and more. With a sleek, modern interface and theme switching capabilities, TanhaApp is designed for both functionality and user experience.

## Features

- **Component-Based Architecture**: Built with React and Next.js for a modular and scalable codebase.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Comprehensive Tooling**: Includes a variety of tools such as a calculator, messenger, and to-do list.
- **Changelog**: Stay updated with the latest changes and features.
- **Search and Filter**: Easily find the tools you need with a search bar and category filters.

## Getting Started

To get started with TanhaApp, you'll need to have Node.js and pnpm installed.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or later)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tanha-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tanha-app
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```

### Running the Development Server

To run the development server, use the following command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Once the development server is running, you can navigate through the application to explore the various tools. The homepage provides an overview of all available tools, which can be searched and filtered by category. The theme can be switched between light and dark mode using the toggle in the header.

## Prisma Setup

This project uses Prisma for database management. You will need to have PostgreSQL installed and running.

1. **Install PostgreSQL**: Follow the official instructions for your operating system.
2. **Configure the Database Connection**: Create a `.env` file in the root of the project and add your database connection URL:

   ```
   DATABASE_URL="postgresql://postgres:****@localhost:5432/****?schema=public"
   ```

   Replace `****` with your PostgreSQL password and database name.

3. **Run Prisma Commands**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

This will set up the database schema and generate the Prisma Client.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.
