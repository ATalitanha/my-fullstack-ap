"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify({ username, email, password }),
				headers: { "Content-Type": "application/json" },
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/login");
			} else {
				setError(data.message || "ثبت نام ناموفق بود.");
			}
		} catch {
			setError("خطایی در اتصال به سرور رخ داد.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold mb-2">ایجاد حساب کاربری جدید</h1>
						<p className="text-gray-600 dark:text-gray-400">
							حساب کاربری خود را ایجاد کنید و از تمام امکانات استفاده کنید ✨
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
						{error && (
							<div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
								<AlertCircle className="text-red-500" size={20} />
								<p className="text-red-700 dark:text-red-300 text-sm font-medium">
									{error}
								</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									نام کاربری
								</label>
								<div className="relative">
									<User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
									<input
										placeholder="نام کاربری خود را وارد کنید"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									آدرس ایمیل
								</label>
								<div className="relative">
									<Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
									<input
										placeholder="example@email.com"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									رمز عبور
								</label>
								<div className="relative">
									<Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
									<input
										placeholder="یک رمز عبور قوی انتخاب کنید"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={6}
										className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{loading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span>در حال ایجاد حساب...</span>
									</>
								) : (
									<>
										<UserPlus size={20} />
										<span>ایجاد حساب</span>
									</>
								)}
							</button>
						</form>

						<div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								قبلاً حساب کاربری ساخته‌اید؟{" "}
								<Link href="/login" className="text-primary hover:underline font-semibold">
									وارد شوید
								</Link>
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
