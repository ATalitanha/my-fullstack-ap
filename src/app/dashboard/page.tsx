"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, User, LogOut, Settings, Activity } from "lucide-react";
import Link from "next/link";

type User = { id: string; username: string; email?: string };

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchAccessToken = useCallback(async () => {
		try {
			const res = await fetch("/api/auth/refresh");
			const data = await res.json();
			if (res.ok) {
				const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
				setUser({
					id: payload.id,
					username: payload.username,
					email: payload.email,
				});
			} else {
				router.push("/login");
			}
		} catch {
			router.push("/login");
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		fetchAccessToken();
	}, [fetchAccessToken]);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/login");
	};

	if (loading)
		return (
			<main className="min-h-screen flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mb-4"></div>
				<p className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</p>
			</main>
		);

	if (!user) return null;

	return (
		<>
			<header className="fixed w-full flex justify-between items-center p-4 h-16 top-0 z-50">
				<Link href="/" className="p-2">
					<ArrowLeft className="w-6 h-6" />
				</Link>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<User size={18} />
						<span>{user.username}</span>
					</div>
					<ThemeToggle />
				</div>
			</header>
			<main className="min-h-screen pt-24 p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">داشبورد</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl">
							حساب کاربری خود را مدیریت کنید و به تمام امکانات دسترسی داشته باشید ✨
						</p>
					</div>
					<div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
							<div className="flex items-center gap-4 mb-6">
								<div className="p-3 bg-primary/10 rounded-full">
									<User className="text-primary" size={28} />
								</div>
								<div>
									<h2 className="text-2xl font-bold">اطلاعات کاربری</h2>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										اطلاعات حساب کاربری خود را مشاهده و مدیریت کنید
									</p>
								</div>
							</div>
							<div className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
										<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">نام کاربری</p>
										<p className="text-lg font-semibold">{user.username}</p>
									</div>
									<div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
										<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">آدرس ایمیل</p>
										<p className="text-lg font-semibold">{user.email || "ارائه نشده"}</p>
									</div>
								</div>
								<div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
									<Activity className="text-primary" size={20} />
									<div>
										<p className="font-semibold text-primary">وضعیت حساب: فعال</p>
										<p className="text-sm text-primary/80">حساب شما به طور عادی فعال است</p>
									</div>
								</div>
							</div>
						</div>
						<div className="lg:col-span-1 space-y-6">
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
								<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
									<Settings size={20} />
									اقدامات سریع
								</h3>
								<div className="space-y-3">
									<button className="w-full py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-right font-semibold">
										ویرایش پروفایل
									</button>
									<button className="w-full py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-right font-semibold">
										تغییر رمز عبور
									</button>
								</div>
							</div>
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
								<button onClick={handleLogout} className="w-full py-3 px-4 rounded-xl bg-danger text-white hover:bg-danger/90 transition-colors flex items-center justify-center gap-2 font-semibold">
									<LogOut size={18} />
									خروج از حساب
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
