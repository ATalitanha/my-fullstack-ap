"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: { "Content-Type": "application/json" },
			});

			const data = await res.json();
			if (res.ok) {
				localStorage.setItem("token", data.token);
				router.push("/dashboard");
			} else {
				setError(data.error || "ایمیل یا رمز عبور نادرست است.");
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
						<h1 className="text-4xl font-bold mb-2">ورود به حساب کاربری</h1>
						<p className="text-gray-600 dark:text-gray-400">
							وارد حساب کاربری خود شوید و از امکانات استفاده کنید ✨
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
										placeholder="رمز عبور خود را وارد کنید"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
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
										<span>در حال ورود...</span>
									</>
								) : (
									<>
										<LogIn size={20} />
										<span>ورود</span>
									</>
								)}
							</button>
						</form>

						<div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								حساب کاربری ندارید؟{" "}
								<Link href="/signup" className="text-primary hover:underline font-semibold">
									ثبت نام کنید
								</Link>
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
