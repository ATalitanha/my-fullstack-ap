/**
 * Reason: Defines TypeScript types for the authentication feature.
 * These types are derived from Zod schemas to ensure consistency and are used
 * across the application for props, API responses, and hooks.
 */
import { z } from "zod";
import { loginSchema, signupSchema } from "./auth.schema";

export type ILogin = z.infer<typeof loginSchema>;
export type ISignup = z.infer<typeof signupSchema>;

export interface AuthState {
	token: string | null;
	user: { id: string; username: string } | null;
	isLoading: boolean;
	error: string | null;
}
