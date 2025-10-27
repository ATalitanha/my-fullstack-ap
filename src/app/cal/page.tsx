"use client";

import Header from "@/components/ui/header";
import Link from "next/link";
import { Calculator, Ruler, Zap } from "lucide-react";

export default function CalPage() {
	const calculatorTools = [
		{
			href: "/cal/calc",
			title: "ماشین حساب ساده",
			description: "برای محاسبات روزمره و عملیات پایه ریاضی.",
			icon: Calculator,
		},
		{
			href: "/cal/units",
			title: "مبدل واحد",
			description: "تبدیل بین واحدهای مختلف اندازه‌گیری.",
			icon: Ruler,
		},
		{
			href: "/cal/advanc-cal",
			title: "ماشین حساب پیشرفته",
			description: "برای محاسبات علمی و پیچیده با امکانات حرفه‌ای.",
			icon: Zap,
		},
	];

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">ابزارهای ماشین حساب</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
							مجموعه‌ای کامل از ابزارهای محاسباتی برای نیازهای مختلف شما ✨
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{calculatorTools.map((tool) => {
							const IconComponent = tool.icon;
							return (
								<Link
									key={tool.href}
									href={tool.href}
									className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
								>
									<div className="p-4 bg-primary/10 rounded-full mb-4">
										<IconComponent className="text-primary" size={32} />
									</div>
									<h3 className="text-xl font-bold mb-2">{tool.title}</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										{tool.description}
									</p>
								</Link>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}
