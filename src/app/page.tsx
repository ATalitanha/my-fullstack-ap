"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChangeLog } from "@/components/change-log";
import ThemeToggle from "@/components/ThemeToggle";
import {
	Search,
	Sparkles,
	Zap,
	TrendingUp,
	Calculator,
	MessageSquare,
	ListTodo,
	StickyNote,
	User,
	LogIn,
	BarChart,
} from "lucide-react";

export default function HomePage() {
	const [isChangeLogOpen, setIsChangeLogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(false);
	}, []);

	const links = [
		{
			href: "/cal",
			label: "ماشین حساب",
			icon: Calculator,
			category: "ابزارها",
			popular: true,
		},
		{
			href: "/messenger",
			label: "انتقال متن",
			icon: MessageSquare,
			category: "ارتباطات",
		},
		{
			href: "/todo",
			label: "لیست کارها",
			icon: ListTodo,
			category: "بهره وری",
			popular: true,
		},
		{
			href: "/notes",
			label: "یادداشت ها",
			icon: StickyNote,
			category: "بهره وری",
		},
		{
			href: "/dashboard",
			label: "حساب کاربری",
			icon: User,
			category: "حساب",
		},
		{
			href: "/login",
			label: "ورود / ثبت نام",
			icon: LogIn,
			category: "حساب",
		},
		{
			href: "/Prices-table",
			label: "قیمت لحظه ای طلا و ارز",
			icon: BarChart,
			category: "مالی",
			new: true,
		},
	];

	const filteredLinks = links.filter(
		(link) =>
			link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
			link.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const categories = [...new Set(links.map((link) => link.category))];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
				<div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
			</div>
		);
	}

	return (
		<>
			<main className="flex flex-col items-center min-h-screen px-4 pb-16 bg-gray-100 dark:bg-gray-900">
				<div className="flex items-center justify-between w-full max-w-7xl mt-6">
					<ThemeToggle />
					<button
						onClick={() => setIsChangeLogOpen(true)}
						className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95"
					>
						<Sparkles size={18} />
						تغییرات نسخه
					</button>
				</div>
				<div className="my-12 text-center">
					<h1 className="mb-6 text-5xl font-extrabold text-gray-800 dark:text-gray-100 md:text-6xl">
						به{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							TanhaApp
						</span>{" "}
						خوش آمدید
					</h1>
					<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
						مجموعه ای کامل از ابزارهای کاربردی و هوشمند برای بهبود بهره وری
						روزانه شما ✨
					</p>
				</div>
				<div className="relative w-full max-w-2xl mb-8">
					<Search
						className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<input
						type="text"
						placeholder="جستجوی ابزارها..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full py-4 pl-12 pr-4 text-lg bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-800 dark:border-gray-700"
					/>
				</div>
				<div className="flex flex-wrap justify-center gap-3 mb-8">
					<button
						onClick={() => setSearchTerm("")}
						className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
							searchTerm === ""
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						}`}
					>
						همه
					</button>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSearchTerm(category)}
							className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
								searchTerm === category
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							}`}
						>
							{category}
						</button>
					))}
				</div>
				<div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredLinks.map((link) => {
						const Icon = link.icon;
						return (
							<div key={link.href} className="relative group">
								{link.popular && (
									<div className="absolute z-20 -top-2 -right-2">
										<div className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-amber-500 rounded-full">
											<TrendingUp size={12} />
											<span>محبوب</span>
										</div>
									</div>
								)}
								{link.new && (
									<div className="absolute z-20 -top-2 -right-2">
										<div className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-500 rounded-full">
											<Zap size={12} />
											<span>جدید</span>
										</div>
									</div>
								)}
								<Link
									href={link.href}
									className="flex flex-col items-center justify-center h-44 text-center font-semibold text-lg bg-white rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:bg-gray-50 dark:bg-gray-800 dark:group-hover:bg-gray-700"
								>
									<Icon className="w-8 h-8 mb-4 text-blue-500" />
									<span className="text-gray-800 dark:text-gray-100">
										{link.label}
									</span>
									<div className="px-2 py-1 mt-2 text-xs text-gray-500 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400">
										{link.category}
									</div>
								</Link>
							</div>
						);
					})}
				</div>
				{filteredLinks.length === 0 && (
					<div className="py-12 text-center">
						<div className="mb-4 text-6xl">🔍</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
							نتیجه ای یافت نشد
						</h3>
						<p className="text-gray-500">
							هیچ ابزاری با "{searchTerm}" مطابقت ندارد
						</p>
					</div>
				)}
			</main>
			<ChangeLog
				isOpen={isChangeLogOpen}
				onClose={() => setIsChangeLogOpen(false)}
			/>
		</>
	);
}
