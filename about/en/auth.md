# Authentication and Security System

TanhaApp utilizes a token-based authentication system (JWT) to protect user data.

## System Components

### 1. Signup and Login (`/signup`, `/login`)
- **Encryption**: User passwords are hashed using `bcrypt` before being stored in the database.
- **Validation**: Ensures that email and username are unique.

### 2. Token Management (JWT)
- **Access Token**: A short-lived token for accessing protected APIs.
- **Refresh Token**: Stored in secure (HttpOnly) cookies for automatic session renewal without requiring re-login.

### 3. Protected APIs
Middleware or helper functions like `verifyToken` in `src/shared/lib/auth.ts` are used to validate tokens for API requests.

## Related Folder Structure
- `src/app/api/auth`: Contains routes for signup, login, logout, and token refresh.
- `src/shared/hooks/useAuth.ts`: A custom hook to manage the user's authentication state on the client side.
- `src/app/dashboard`: A page accessible only to authenticated users.

## Security Best Practices Implemented
- Use of **HttpOnly** cookies to prevent XSS attacks.
- Password hashing with appropriate Salting.
- Utilizing **Zod** for schema validation to prevent malicious data injection.
- Server-side and client-side protection for sensitive routes.
