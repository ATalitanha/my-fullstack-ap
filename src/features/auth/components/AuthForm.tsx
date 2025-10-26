/**
 * Reason: A reusable UI component for both login and signup forms.
 * This component abstracts the form state and submission logic, making the login
 * and signup pages cleaner and easier to maintain. It uses the useAuth hook.
 */
"use client";

import { useAuth } from "../hooks/useAuth";
import { ISignup } from "../auth.types";
import { useState } from "react";
import Button from "@/shared/ui/Button";

interface AuthFormProps {
	isLogin: boolean;
}

export default function AuthForm({ isLogin }: AuthFormProps) {
	const { login, signup, isLoading, error } = useAuth();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLogin) {
			await login({ email: formData.email, password: formData.password });
		} else {
			await signup(formData as ISignup);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{!isLogin && (
				<input
					type="text"
					name="username"
					placeholder="نام کاربری"
					onChange={handleChange}
					className="w-full px-4 py-2 border rounded"
					required
				/>
			)}
			<input
				type="email"
				name="email"
				placeholder="ایمیل"
				onChange={handleChange}
				className="w-full px-4 py-2 border rounded"
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="رمز عبور"
				onChange={handleChange}
				className="w-full px-4 py-2 border rounded"
				required
			/>
			{error && <p className="text-red-500">{error}</p>}
			<Button type="submit" disabled={isLoading}>
				{isLoading ? "در حال بارگذاری..." : isLogin ? "ورود" : "ثبت نام"}
			</Button>
		</form>
	);
}
