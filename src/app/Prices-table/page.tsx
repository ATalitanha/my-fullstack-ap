"use client";

import Header from "@/components/ui/header";
import { useEffect, useState } from "react";
import { FaBitcoin, FaDollarSign, FaCoins, FaSearch } from "react-icons/fa";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

type Item = {
	name: string;
	symbol: string;
	price: number;
	unit: string;
	change_percent: number;
};

type MarketData = {
	gold: Item[];
	currency: Item[];
	cryptocurrency: Item[];
};

type Category = "all" | "gold" | "currency" | "cryptocurrency";

const categories: { value: Category; label: string }[] = [
	{ value: "all", label: "همه دسته‌ها" },
	{ value: "gold", label: "طلا و سکه" },
	{ value: "currency", label: "ارزها" },
	{ value: "cryptocurrency", label: "ارزهای دیجیتال" },
];

export default function PricesTablePage() {
	const [data, setData] = useState<MarketData | null>(null);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<Category>("all");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const res = await fetch(
					`https://brsapi.ir/Api/Market/Gold_Currency.php?key=${process.env.API_KEY}`,
				);
				const json = await res.json();
				setData(json);
			} catch (error) {
				console.error("خطا در دریافت اطلاعات:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mb-4"></div>
				<p className="text-gray-600 dark:text-gray-300">در حال بارگذاری اطلاعات بازار...</p>
			</main>
		);
	}

	if (!data) {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center">
				<div className="text-center">
					<DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-300 text-lg">خطا در دریافت اطلاعات بازار</p>
					<p className="text-gray-500 dark:text-gray-400 text-sm mt-2">لطفاً اتصال اینترنت خود را بررسی کنید</p>
				</div>
			</main>
		);
	}

	let items: Item[] = [];
	if (data) {
		if (category === "all") {
			items = [...data.gold, ...data.currency, ...data.cryptocurrency];
		} else {
			items = data[category];
		}
	}

	items = items.filter(
		(item: Item) =>
			item.name.toLowerCase().includes(search.toLowerCase()) ||
			item.symbol.toLowerCase().includes(search.toLowerCase()),
	);

	const getIcon = (itemCategory: Category) => {
		if (itemCategory === "cryptocurrency")
			return <FaBitcoin className="text-yellow-500 w-6 h-6" />;
		if (itemCategory === "currency")
			return <FaDollarSign className="text-green-500 w-6 h-6" />;
		return <FaCoins className="text-orange-400 w-6 h-6" />;
	};

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">قیمت‌های لحظه‌ای</h1>
						<p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
							قیمت‌های لحظه‌ای طلا، ارز و ارزهای دیجیتال را دنبال کنید ✨
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="جستجو بر اساس نام یا نماد..."
									className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<div className="w-full md:w-64">
								<Select.Root value={category} onValueChange={(value) => setCategory(value as Category)}>
									<Select.Trigger className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 flex justify-between items-center text-right">
										<Select.Value>{categories.find((c) => c.value === category)?.label}</Select.Value>
										<Select.Icon><ChevronDownIcon /></Select.Icon>
									</Select.Trigger>
									<Select.Portal>
										<Select.Content side="bottom" position="popper" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 w-[var(--radix-select-trigger-width)]">
											<Select.Viewport className="p-2">
												{categories.map((cat) => (
													<Select.Item key={cat.value} value={cat.value} className="p-3 rounded-lg cursor-pointer hover:bg-primary/10 text-right">
														<Select.ItemText>{cat.label}</Select.ItemText>
													</Select.Item>
												))}
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{items.map((item) => {
							const itemCategory = data.gold.some((i) => i.symbol === item.symbol)
								? "gold"
								: data.currency.some((i) => i.symbol === item.symbol)
									? "currency"
									: "cryptocurrency";
							return (
								<div key={item.symbol} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											{getIcon(itemCategory)}
											<div>
												<h3 className="font-bold text-lg">{item.name}</h3>
												<p className="text-gray-500 dark:text-gray-400 text-sm">{item.symbol}</p>
											</div>
										</div>
										<div className={`p-2 rounded-xl ${item.change_percent >= 0 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
											{item.change_percent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
										</div>
									</div>
									<div className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-gray-600 dark:text-gray-400 text-sm">قیمت:</span>
											<span className="font-bold text-lg">{item.price.toLocaleString()}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 dark:text-gray-400 text-sm">واحد:</span>
											<span className="font-semibold">{item.unit}</span>
										</div>
										<div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
											<span className="text-gray-600 dark:text-gray-400 text-sm">تغییر:</span>
											<span className={`font-bold ${item.change_percent >= 0 ? "text-green-600" : "text-red-600"}`}>
												{item.change_percent >= 0 ? "+" : ""}{item.change_percent}%
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{items.length === 0 && (
						<div className="text-center py-16">
							<DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">نتیجه‌ای یافت نشد</h3>
							<p className="text-gray-500">هیچ موردی با عبارت "{search}" یافت نشد</p>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
