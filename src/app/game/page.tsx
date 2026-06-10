"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gamepad2, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useLanguage";
import theme from "@/lib/theme";
import MouseHover from "@/shared/ui/mouseHover";
import HybridLoading from "../loading";

export default function GamePage() {
	const [isLoading, setIsLoading] = useState(true);
	const { t, language } = useTranslation("app.game");

	useEffect(() => {
		setIsLoading(false);
	}, []);

	const games = [
		{
			href: "/game/2048",
			title: t("games.2048.title"),
			description: t("games.2048.description"),
			icon: Gamepad2,
			color: "from-amber-500 to-orange-600",
			cardColor:
				"from-gray-300/50 to-amber-300/50 dark:from-gray-500/50 dark:to-amber-500/50",
			iconColor: "text-amber-500",
			delay: 0.1,
		},
	];

	if (isLoading) {
		return <HybridLoading />;
	}

	return (
		<>
			<MouseHover />
			<div
				className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
			>
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
				</div>
				<div className="container mx-auto px-4 py-12 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-12"
					>
						<motion.div
							whileHover={{ scale: 1.02 }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10  text-blue-600 dark:text-blue-400 text-sm mb-6"
						>
							<Sparkles size={16} />
							<span>{t("subtitle")}</span>
						</motion.div>
						<h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
							<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
								{t("title")}
							</span>
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
							{t("description")}
						</p>
					</motion.div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{games.map((game) => {
							const IconComponent = game.icon;
							return (
								<motion.div
									key={game.href}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: game.delay }}
									whileHover={{
										scale: 1.05,
										y: -5,
										transition: { type: "spring", stiffness: 400, damping: 25 },
									}}
									whileTap={{ scale: 0.98 }}
									className="group relative"
								>
									<Link href={game.href} className="block h-full">
										<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:shadow-3xl group-hover:bg-white/90 dark:group-hover:bg-gray-800/90 h-full flex flex-col">
											<div
												className={`p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-linear-to-r ${game.cardColor} `}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div
															className={`p-3 bg-linear-to-br ${game.color} rounded-xl shadow-lg`}
														>
															<IconComponent className="text-white" size={24} />
														</div>
														<div>
															<h3 className="text-xl font-bold text-gray-800 dark:text-white">
																{game.title}
															</h3>
															<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
																{t("game_list")}
															</p>
														</div>
													</div>
													<motion.div
														whileHover={{ scale: 1.2, x: 3 }}
														className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white group-hover:bg-blue-500 group-hover:text-white transition-colors"
													>
														{language === "fa" ? (
															<ArrowLeft size={16} />
														) : (
															<ArrowRight size={16} />
														)}
													</motion.div>
												</div>
											</div>
											<div className="p-6 flex-1 flex flex-col">
												<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
													{game.description}
												</p>
												<div
													className={`absolute inset-0 bg-linear-to-br ${game.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
												/>
												<motion.div
													whileHover={{ scale: 1.02 }}
													className="mt-auto"
												>
													<div className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-blue-500 group-hover:to-blue-600 text-gray-700 dark:text-gray-300 group-hover:text-white transition-all duration-300 text-center font-semibold text-sm">
														{t("play")}
													</div>
												</motion.div>
											</div>
										</div>
									</Link>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}
