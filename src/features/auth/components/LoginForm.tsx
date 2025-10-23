/**
 * Reason: A dedicated component for the login page.
 * This component wraps the reusable AuthForm, providing a clean and simple
 * interface for the login page.
 */
'use client';

import AuthForm from './AuthForm';

export default function LoginForm() {
  return <AuthForm isLogin={true} />;
}
