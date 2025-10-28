"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		setIsLoading(false);

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const links = [
		{
			href: "/cal",
			label: "Calculator",
			icon: Calculator,
			category: "Tools",
			popular: true,
		},
		{
			href: "/messenger",
			label: "Messenger",
			icon: MessageSquare,
			category: "Communication",
		},
		{
			href: "/todo",
			label: "Todo List",
			icon: ListTodo,
			category: "Productivity",
			popular: true,
		},
		{
			href: "/notes",
			label: "Notes",
			icon: StickyNote,
			category: "Productivity",
		},
		{
			href: "/dashboard",
			label: "Dashboard",
			icon: User,
			category: "Account",
		},
		{
			href: "/login",
			label: "Login / Signup",
			icon: LogIn,
			category: "Account",
		},
		{
			href: "/Prices-table",
			label: "Real-time Gold and Currency Prices",
			icon: BarChart,
			category: "Financial",
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
			<div
				className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
				style={{
					background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`,
				}}
			/>
			<main className="flex flex-col items-center min-h-screen px-4 pb-16 bg-gray-100 dark:bg-gray-900">
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.5 }}
					className="flex items-center justify-between w-full max-w-7xl mt-6"
				>
					<ThemeToggle />
					<button
						onClick={() => setIsChangeLogOpen(true)}
						className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95"
					>
						<Sparkles size={18} />
						Changelog
					</button>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="my-12 text-center"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm text-blue-600 bg-blue-500/10 border border-blue-500/20 rounded-full dark:text-blue-400"
					>
						<Sparkles size={16} />
						<span>A collection of the best tools</span>
					</motion.div>
					<h1 className="mb-6 text-5xl font-extrabold text-gray-800 dark:text-gray-100 md:text-6xl">
						Welcome to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							TanhaApp
						</span>
					</h1>
					<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
						A complete suite of practical and intelligent tools to improve your
						daily productivity ✨
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.6 }}
					className="relative w-full max-w-2xl mb-8"
				>
					<Search
						className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
						size={20}
					/>
					<input
						type="text"
						placeholder="Search tools..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full py-4 pl-12 pr-4 text-lg bg-white/80 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-800/80 dark:border-gray-700"
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex flex-wrap justify-center gap-3 mb-8"
				>
					<button
						onClick={() => setSearchTerm("")}
						className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
							searchTerm === ""
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						}`}
					>
						All
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
				</motion.div>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					<AnimatePresence>
						{filteredLinks.map((link) => {
							const Icon = link.icon;
							return (
								<motion.div
									key={link.href}
									layout
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ type: "spring", stiffness: 300, damping: 25 }}
									whileHover={{
										scale: 1.03,
										y: -5,
										transition: { type: "spring", stiffness: 400, damping: 25 },
									}}
									whileTap={{ scale: 0.98 }}
									className="relative group"
								>
									{link.popular && (
										<div className="absolute z-20 -top-2 -right-2">
											<div className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-amber-500 rounded-full">
												<TrendingUp size={12} />
												<span>Popular</span>
											</div>
										</div>
									)}
									{link.new && (
										<div className="absolute z-20 -top-2 -right-2">
											<div className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-500 rounded-full">
												<Zap size={12} />
												<span>New</span>
											</div>
										</div>
									)}
									<Link
										href={link.href}
										className="flex flex-col items-center justify-center h-44 text-center font-semibold text-lg bg-white/70 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white/90 dark:bg-gray-800/70 dark:group-hover:bg-gray-800/90"
									>
										<Icon className="w-8 h-8 mb-4 text-blue-500" />
										<span className="text-gray-800 dark:text-gray-100">
											{link.label}
										</span>
										<div className="px-2 py-1 mt-2 text-xs text-gray-500 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400">
											{link.category}
										</div>
									</Link>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</motion.div>
				{filteredLinks.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="py-12 text-center"
					>
						<div className="mb-4 text-6xl">🔍</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
							No results found
						</h3>
						<p className="text-gray-500">
							No tools match "{searchTerm}"
						</p>
					</motion.div>
				)}
			</main>
			<ChangeLog
				isOpen={isChangeLogOpen}
				onClose={() => setIsChangeLogOpen(false)}
			/>
		</>
	);
}
