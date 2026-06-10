# API Documentation

This document covers the available API endpoints in the project.

## 1. Authentication (`/api/auth`)

- **`POST /api/auth/signup`**:
  - Input: `username`, `email`, `password`.
  - Logic: Creates a new user in the database with a hashed password.
- **`POST /api/auth/login`**:
  - Logic: Authenticates user and sets JWT cookies.
- **`GET /api/auth/refresh`**:
  - Logic: Renews the Access Token using the Refresh Token.
- **`POST /api/auth/logout`**:
  - Logic: Clears authentication cookies.

## 2. Notes and Todos (`/api/notes`, `/api/todo`)

Both follow a similar pattern:
- **`GET`**: Fetches items belonging to the authenticated user.
- **`POST`**: Creates a new item.
- **`PUT /id`**: Updates an existing item.
- **`DELETE /id`**: Deletes an item.

## 3. Messenger (`/api/massage`)

- **`GET`**: Fetches all public messages.
- **`POST`**: Sends a new message.
- **`DELETE`**: Deletes messages (single by ID or all with `deleteAll` parameter).

## 4. Calculator History (`/api/history`, `/api/adhistory`)

Saves and retrieves calculations performed by users for the "History" section.
- **`POST`**: Saves the expression (`expr`) and the `result`.
- **`GET`**: Fetches the latest calculations.
- **`DELETE`**: Clears the history.
