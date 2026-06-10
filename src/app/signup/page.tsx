"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	Lock,
	Mail,
	Sparkles,
	User,
	UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useLanguage";
import theme from "@/lib/theme";
import { useAuth } from "@/shared/hooks/useAuth";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";

export default function SignupPage() {
	/**
	 * وضعیت احراز هویت و فرم ثبت‌نام
	 */

	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.replace("/dashboard");
		}
	}, [user, loading, router]);

	// مقادیر فرم
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// وضعیت خطا و لودینگ
	const [error, setError] = useState<string | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { t } = useTranslation("app.signup");

	// ردیابی موقعیت ماوس
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// تابع ارسال فرم
	/**
	 * ارسال فرم ثبت‌نام و هدایت به ورود
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

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
				setError(data.message || t("error_failed"));
			}
		} catch {
			setError("خطایی در ارتباط با سرور رخ داد.");
		} finally {
		}
	};

	return (
		<>
			{/* افکت دنبال کننده ماوس */}
			<div
				className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
				style={{
					background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.1) 0%, transparent 80%)`,
				}}
			/>

			{/* بخش اصلی */}
			<div
				className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
			>
				{/* افکت‌های پس‌زمینه */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
				</div>

				<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="w-full max-w-md"
					>
						{/* هدر فرم */}
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="text-center mb-8"
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-4"
							>
								<Sparkles size={16} />
								<span>{t("subtitle")}</span>
							</motion.div>

							<h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
									{t("title")}
								</span>
							</h1>

							<p className="text-gray-600 dark:text-gray-400 text-lg">
								{t("description")}
							</p>
						</motion.div>

						{/* کارت فرم */}
						<Card className="p-8">
							{/* نمایش پیام خطا */}
							<AnimatePresence>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10, height: 0 }}
										animate={{ opacity: 1, y: 0, height: "auto" }}
										exit={{ opacity: 0, y: -10, height: 0 }}
										className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
									>
										<div className="flex items-center gap-3">
											<AlertCircle
												className="text-red-500 flex-shrink-0"
												size={20}
											/>
											<p className="text-red-700 dark:text-red-300 text-sm font-medium">
												{error}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* فرم ثبت نام */}
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* فیلد نام کاربری */}
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{t("username")}
									</label>
									<div className="relative">
										<div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
											<User size={20} />
										</div>
										<Input
											placeholder={t("username_placeholder")}
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											required
											uiSize="lg"
											className="pr-12"
										/>
									</div>
								</div>

								{/* فیلد ایمیل */}
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{t("email")}
									</label>
									<div className="relative">
										<div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
											<Mail size={20} />
										</div>
										<Input
											placeholder="example@email.com"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											uiSize="lg"
											className="pr-12"
										/>
									</div>
								</div>

								{/* فیلد رمز عبور */}
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										{t("password")}
									</label>
									<div className="relative">
										<div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
											<Lock size={20} />
										</div>
										<Input
											placeholder={t("password_placeholder")}
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											uiSize="lg"
											className="pr-12"
										/>
									</div>
								</div>

								{/* دکمه ثبت نام */}
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									disabled={loading}
									className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                  text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                  transition-all duration-200 flex items-center justify-center gap-2 
                  disabled:opacity-60 disabled:cursor-not-allowed"
								>
									{loading ? (
										<>
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
											{t("submitting")}
										</>
									) : (
										<>
											<UserPlus size={20} />
											{t("submit")}
										</>
									)}
								</motion.button>
							</form>

							{/* لینک ورود */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
							>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{t("have_account")}{" "}
									<motion.a
										whileHover={{ scale: 1.05 }}
										href="/login"
										className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
									>
										{t("login")}
									</motion.a>
								</p>
							</motion.div>
						</Card>

						{/* اطلاعات امنیتی */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="text-center mt-6"
						>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{t("security_info") ||
									"Your information is protected by security standards"}
							</p>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</>
	);
}
