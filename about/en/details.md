# Technical Details of Files and Functions

This document provides a deeper look into some of the key files and important functions of the project.

## 1. Language Management (`src/constants/LanguageContext.js`)

This file is the heart of the application's multi-language system.

- **`SUPPORTED_LANGUAGES`**: An array of objects containing language code, name, direction (RTL/LTR), and Locale.
- **`LanguageProvider`**: A component that wraps the entire application.
  - **`useState`**: To hold the current language, direction, and dictionary.
  - **`useEffect` (Initialization)**: Reads the user's preferred language from `localStorage`.
  - **`changeLanguage`**: An asynchronous function that loads the new dictionary and updates the state.
  - **`t` (Translation Function)**: Uses `useCallback` for better performance. It splits the key by dots (`.`) and traverses the dictionary's JSON tree.

## 2. 2048 Game (`src/app/game/2048/page.tsx`)

The game logic is implemented in this file.

- **`move`**: The main game function.
  - Input: Movement direction (`up`, `down`, `left`, `right`).
  - Process: First sorts the tiles based on the direction. Then, in a loop, moves each tile as far as possible.
  - **Merge**: If two tiles with the same value collide and haven't been merged in that move, they combine.
- **`spawnTile`**: Creates a new tile with a value of 2 (90% chance) or 4 (10% chance) in a random empty position (`getEmptyPositions`).

## 3. Calculator (`src/components/CalculatorContent.tsx`)

- **`loadMathjs`**: To optimize the initial bundle size, the `mathjs` library is loaded dynamically only when needed.
- **`handleInput`**: Manages user inputs. For example, it checks if there is a corresponding open parenthesis before adding a closing one.
- **`calcResult`**: Uses the `mathjs.evaluate` function to compute the string expression.

## 4. Messenger (`src/app/messenger/page.tsx`)

- **`fetchMessages`**: Sends a GET request to the internal `/api/massage` API using `fetch`.
- **`handleSubmit`**: Validates form data and sends it as a POST request. Uses `framer-motion` to display success/error messages.

## 5. Application Header (`src/components/ui/header.tsx`)

- **`canGoBack`**: Detects whether the back button should be displayed using `window.history.length` and the current `pathname`.
- **`MobileMenu`**: A sub-component that opens from the right with a blur effect and animation.
