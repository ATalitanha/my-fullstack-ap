"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import {
	Search,
	Calculator,
	MessageSquare,
	ListTodo,
	StickyNote,
	User,
	LogIn,
	BarChart,
} from "lucide-react";

export default function HomePage() {
	const [searchTerm, setSearchTerm] = useState("");

	const links = [
		{
			href: "/cal",
			label: "ماشین حساب",
			icon: Calculator,
			category: "ابزارها",
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
			category: "بهره‌وری",
		},
		{
			href: "/notes",
			label: "یادداشت‌ها",
			icon: StickyNote,
			category: "بهره‌وری",
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
			label: "قیمت لحظه‌ای طلا و ارز",
			icon: BarChart,
			category: "مالی",
		},
	];

	const filteredLinks = links.filter(
		(link) =>
			link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
			link.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<main className="flex flex-col items-center min-h-screen p-4">
			<div className="flex items-center justify-between w-full max-w-7xl mb-8">
				<h1 className="text-3xl font-bold">اپلیکیشن تنها</h1>
				<ThemeToggle />
			</div>

			<div className="w-full max-w-2xl mb-8">
				<div className="relative">
					<Search
						className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<input
						type="text"
						placeholder="جستجوی ابزارها..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full py-3 pr-12 pl-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700"
					/>
				</div>
			</div>

			<div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredLinks.map((link) => {
					const Icon = link.icon;
					return (
						<Link
							key={link.href}
							href={link.href}
							className="flex flex-col items-center justify-center h-44 text-center font-semibold text-lg bg-white rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800"
						>
							<Icon className="w-10 h-10 mb-4 text-primary" />
							<span>{link.label}</span>
							<div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
								{link.category}
							</div>
						</Link>
					);
				})}
			</div>

			{filteredLinks.length === 0 && (
				<div className="py-12 text-center">
					<div className="mb-4 text-6xl">🔍</div>
					<h3 className="text-xl font-semibold">نتیجه‌ای یافت نشد</h3>
					<p className="text-gray-500">
						هیچ ابزاری با عبارت "{searchTerm}" یافت نشد.
					</p>
				</div>
			)}
		</main>
	);
}
