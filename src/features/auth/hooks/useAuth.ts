/**
 * Reason: Provides a custom hook for managing authentication state.
 * This hook encapsulates the logic for login, logout, and token management,
 * making it easy for components to access user data and auth status.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthState, ILogin, ISignup } from "../auth.types";

export function useAuth(): AuthState & {
	login: (credentials: ILogin) => Promise<void>;
	signup: (userData: ISignup) => Promise<void>;
	logout: () => void;
} {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<{ id: string; username: string } | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchAccessToken = async () => {
			try {
				const res = await fetch("/api/auth/refresh");
				const data = await res.json();
				if (res.ok) {
					setToken(data.accessToken);
					const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
					setUser({ id: payload.id, username: payload.username });
				}
			} catch {
				// No refresh token, user is not logged in
			} finally {
				setIsLoading(false);
			}
		};
		fetchAccessToken();
	}, []);

	const login = async (credentials: ILogin) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(credentials),
			});
			const data = await res.json();
			if (res.ok) {
				setToken(data.accessToken);
				const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
				setUser({ id: payload.id, username: payload.username });
				router.push("/dashboard");
			} else {
				setError(data.error || "Login failed");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (userData: ISignup) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData),
			});
			const data = await res.json();
			if (res.ok) {
				router.push("/login");
			} else {
				setError(data.error || "Signup failed");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setToken(null);
		setUser(null);
		router.push("/login");
	};

	return { token, user, isLoading, error, login, signup, logout };
}
