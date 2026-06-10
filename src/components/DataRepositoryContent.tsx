/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/a11y/useButtonType: <> */
"use client";

import { AnimatePresence } from "framer-motion";
import {
	AlertCircle,
	CheckCircle,
	Database,
	Edit3,
	FolderOpen,
	Plus,
	Search,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { lazy, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useLanguage";
import MouseHover from "@/shared/ui/mouseHover";

// داینامیک ایمپورت برای کامپوننت‌های سنگین
const MotionDiv = dynamic(
	() => import("framer-motion").then((m) => m.motion.div),
	{ ssr: false },
);

const MotionButton = dynamic(
	() => import("framer-motion").then((m) => m.motion.button),
	{ ssr: false },
);

const MotionTr = dynamic(
	() => import("framer-motion").then((m) => m.motion.tr),
	{ ssr: false },
);

const BlockMath = lazy(() =>
	import("react-katex").then((module) => ({
		default: module.BlockMath,
	})),
) as any;

const CategoryManager = dynamic(() => import("@/components/CategoryManager"), {
	ssr: false,
});

const ConfirmModal = dynamic(() => import("@/components/DeleteConfirmModal"), {
	ssr: false,
});

// Types
type Category = {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	icon: string | null;
	sortOrder: number;
	_count?: { entries: number; subCategories: number };
};

type SubCategory = {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	icon: string | null;
	categoryId: string;
	category?: { id: string; name: string; color: string | null };
	_count?: { entries: number };
};

type DailyEntry = {
	id: string;
	title: string;
	content: string;
	description: string | null;
	latexContent: string | null;
	type: string;
	tags: string[];
	isFavorite: boolean;
	viewCount: number;
	categoryId: string;
	subCategoryId: string | null;
	category: {
		id: string;
		name: string;
		color: string | null;
		icon: string | null;
	};
	subCategory: {
		id: string;
		name: string;
		color: string | null;
		icon: string | null;
	} | null;
	createdAt: string;
	updatedAt: string;
};

type ResponseMessage = { text: string; type: "success" | "error" | "info" };

export default function DataRepositoryContent() {
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
	const [entries, setEntries] = useState<DailyEntry[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
	const [selectedType, setSelectedType] = useState<string>("");

	// Form states
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [formContent, setFormContent] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formLatex, setFormLatex] = useState("");
	const [formType, setFormType] = useState("TEXT");
	const [formTags, setFormTags] = useState("");
	const [formCategoryId, setFormCategoryId] = useState("");
	const [formSubCategoryId, setFormSubCategoryId] = useState("");
	const [formIsFavorite, setFormIsFavorite] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Modal states
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [toDeleteId, setToDeleteId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	// Response message
	const [response, setResponse] = useState<ResponseMessage | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { t } = useTranslation("app.dataRepo");

	const entryTypes = [
		{ value: "TEXT", label: t("types.TEXT") },
		{ value: "MATH", label: t("types.MATH") },
		{ value: "FORMULA", label: t("types.FORMULA") },
		{ value: "EQUATION", label: t("types.EQUATION") },
		{ value: "DEFINITION", label: t("types.DEFINITION") },
		{ value: "CODE", label: t("types.CODE") },
		{ value: "QUOTE", label: t("types.QUOTE") },
		{ value: "OTHER", label: t("types.OTHER") },
	];

	const showResponse = (resp: ResponseMessage) => {
		setResponse(resp);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setResponse(null), 4000);
	};

	// Fetch categories
	const fetchCategories = useCallback(async () => {
		try {
			const res = await fetch("/api/data-repo/categories");
			const data = await res.json();
			setCategories(data);
		} catch {
			showResponse({ text: "❌ Error fetching categories", type: "error" });
		}
	}, [refreshTrigger]);

	// Fetch subcategories
	const fetchSubCategories = useCallback(
		async (categoryId?: string) => {
			try {
				const url = categoryId
					? `/api/data-repo/subcategories?categoryId=${categoryId}`
					: "/api/data-repo/subcategories";
				const res = await fetch(url);
				const data = await res.json();
				setSubCategories(data);
			} catch {
				showResponse({
					text: "❌ Error fetching subcategories",
					type: "error",
				});
			}
		},
		[refreshTrigger],
	);

	const handleRefresh = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	// Fetch entries
	const fetchEntries = useCallback(async () => {
		try {
			const params = new URLSearchParams();
			if (selectedCategory) params.append("categoryId", selectedCategory);
			if (selectedSubCategory)
				params.append("subCategoryId", selectedSubCategory);
			if (selectedType) params.append("type", selectedType);
			if (searchTerm) params.append("search", searchTerm);

			const res = await fetch(`/api/data-repo/entries?${params}`);
			const data = await res.json();
			setEntries(data.data || []);
		} catch {
			showResponse({ text: "❌ Error fetching entries", type: "error" });
		}
	}, [selectedCategory, selectedSubCategory, selectedType, searchTerm]);

	useEffect(() => {
		const init = async () => {
			await fetchCategories();
			await fetchSubCategories();
			await fetchEntries();
			setIsLoading(false);
		};
		init();
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			fetchSubCategories(selectedCategory);
			setSelectedSubCategory("");
		}
	}, [selectedCategory]);

	useEffect(() => {
		fetchEntries();
	}, [selectedCategory, selectedSubCategory, selectedType, searchTerm]);

	const filteredSubCategories = selectedCategory
		? subCategories.filter((s) => s.categoryId === selectedCategory)
		: subCategories;

	const filteredEntries = entries;

	const resetForm = () => {
		setFormTitle("");
		setFormContent("");
		setFormDescription("");
		setFormLatex("");
		setFormType("TEXT");
		setFormTags("");
		setFormCategoryId("");
		setFormSubCategoryId("");
		setFormIsFavorite(false);
		setEditingEntry(null);
	};

	const openCreateForm = () => {
		resetForm();
		setIsFormOpen(true);
	};

	const openEditForm = (entry: DailyEntry) => {
		setEditingEntry(entry);
		setFormTitle(entry.title);
		setFormContent(entry.content);
		setFormDescription(entry.description || "");
		setFormLatex(entry.latexContent || "");
		setFormType(entry.type);
		setFormTags(entry.tags.join(", "));
		setFormCategoryId(entry.categoryId);
		setFormSubCategoryId(entry.subCategoryId || "");
		setFormIsFavorite(entry.isFavorite);
		setIsFormOpen(true);
	};

	const saveEntry = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formTitle.trim() || !formContent.trim() || !formCategoryId) {
			showResponse({ text: `❌ ${t("messages.error_fill")}`, type: "error" });
			return;
		}

		setSubmitting(true);
		try {
			const url = editingEntry
				? `/api/data-repo/entries/${editingEntry.id}`
				: "/api/data-repo/entries";
			const method = editingEntry ? "PUT" : "POST";

			const tags = formTags
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t);

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: formTitle,
					content: formContent,
					description: formDescription || undefined,
					latexContent: formLatex || undefined,
					type: formType,
					tags,
					isFavorite: formIsFavorite,
					categoryId: formCategoryId,
					subCategoryId: formSubCategoryId || undefined,
				}),
			});

			if (res.ok) {
				showResponse({
					text: editingEntry
						? `✅ ${t("messages.success_update")}`
						: `✅ ${t("messages.success_add")}`,
					type: "success",
				});
				setIsFormOpen(false);
				resetForm();
				fetchEntries();
				fetchCategories();
			} else {
				const data = await res.json();
				showResponse({
					text: `❌ خطا: ${data.error || "ناموفق"}`,
					type: "error",
				});
			}
		} catch {
			showResponse({ text: "❌ خطا در ارتباط با سرور", type: "error" });
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		setToDeleteId(id);
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!toDeleteId) return;
		setDeletingId(toDeleteId);
		setDeleteModalOpen(false);

		try {
			const res = await fetch(`/api/data-repo/entries/${toDeleteId}`, {
				method: "DELETE",
			});
			if (res.ok) {
				showResponse({
					text: `✅ ${t("messages.success_delete")}`,
					type: "success",
				});
				fetchEntries();
				fetchCategories();
			} else {
				showResponse({ text: "❌ Error deleting data", type: "error" });
			}
		} catch {
			showResponse({ text: "❌ Error connecting to server", type: "error" });
		} finally {
			setDeletingId(null);
			setToDeleteId(null);
		}
	};

	const toggleFavorite = async (entry: DailyEntry) => {
		try {
			await fetch(`/api/data-repo/entries/${entry.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isFavorite: !entry.isFavorite }),
			});
			fetchEntries();
		} catch {
			showResponse({ text: "❌ خطا در بروزرسانی", type: "error" });
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen pt-16 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="container mx-auto px-4 py-8">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mb-4" />
						<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
						<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<MouseHover />
			<div className="min-h-screen pt-16 transition-colors duration-700 relative z-0 bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
				</div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-0">
					{/* Header */}
					<MotionDiv
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-6 sm:mb-8"
					>
						<MotionDiv
							whileHover={{ scale: 1.02 }}
							className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs sm:text-sm mb-4 sm:mb-6"
						>
							<Sparkles size={14} className="sm:w-4 sm:h-4" />
							<span>{t("subtitle")}</span>
						</MotionDiv>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
							<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
								{t("title")}
							</span>
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
							{t("description")}
						</p>
					</MotionDiv>

					{/* Search and Filters */}
					<MotionDiv
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 sm:mb-8 space-y-4"
					>
						{/* Search Bar */}
						<div className="relative max-w-2xl mx-auto px-2 sm:px-0">
							<Search
								className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<input
								type="text"
								placeholder={t("search_placeholder")}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg"
							/>
						</div>

						{/* Filter Tabs */}
						<div className="relative">
							<div className="overflow-x-auto scrollbar-hide pb-2">
								<div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start sm:justify-center px-2 min-w-max sm:min-w-0">
									<button
										onClick={() => {
											setSelectedCategory("");
											setSelectedType("");
										}}
										className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
											!selectedCategory && !selectedType
												? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
												: "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-700/60"
										}`}
									>
										{t("all")}
									</button>
									{categories.map((cat) => (
										<button
											key={cat.id}
											onClick={() => setSelectedCategory(cat.id)}
											className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
												selectedCategory === cat.id
													? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
													: "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-700/60"
											}`}
										>
											{cat.name}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* SubCategory and Type Filters */}
						{(selectedCategory || filteredSubCategories.length > 0) && (
							<div className="flex flex-wrap gap-2 justify-center px-2">
								<select
									value={selectedSubCategory}
									onChange={(e) => setSelectedSubCategory(e.target.value)}
									className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border-0 focus:ring-2 focus:ring-blue-500/50 flex-1 sm:flex-none"
								>
									<option value="">{t("all_sub")}</option>
									{filteredSubCategories.map((sub) => (
										<option key={sub.id} value={sub.id}>
											{sub.name}
										</option>
									))}
								</select>

								<select
									value={selectedType}
									onChange={(e) => setSelectedType(e.target.value)}
									className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border-0 focus:ring-2 focus:ring-blue-500/50 flex-1 sm:flex-none"
								>
									<option value="">{t("all_types")}</option>
									{entryTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>
							</div>
						)}
					</MotionDiv>

					{/* Add Button */}
					<div className="flex flex-col sm:flex-row justify-end gap-3 mb-6 px-2">
						<CategoryManager
							categories={categories}
							subCategories={subCategories}
							onRefresh={handleRefresh}
						/>
						<MotionButton
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={openCreateForm}
							className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
						>
							<Plus size={18} className="sm:w-5 sm:h-5" />
							{t("add_new")}
						</MotionButton>
					</div>

					{/* Entries Table - Desktop View */}
					<MotionDiv
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="overflow-x-auto"
					>
						{/* Desktop Table View */}
						<div className="hidden lg:block">
							<table className="w-full">
								<thead className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
									<tr>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.title")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.content")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.category")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.subcategory")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.type")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.tags")}
										</th>
										<th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
											{t("columns.actions")}
										</th>
									</tr>
								</thead>
								<tbody>
									<AnimatePresence mode="popLayout">
										{filteredEntries.map((entry, index) => (
											<MotionTr
												key={entry.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: 20 }}
												transition={{ delay: index * 0.03 }}
												className="border-b border-gray-200 dark:border-gray-700 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors group"
											>
												<td className="px-4 py-4">
													<div className="flex items-center gap-2">
														{entry.isFavorite && (
															<span className="text-amber-500">⭐</span>
														)}
														<span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
															{entry.title}
														</span>
													</div>
												</td>
												<td className="px-4 py-4">
													{entry.latexContent && (
														<div
															dir="ltr"
															className="text-sm text-gray-600 dark:text-gray-400 mb-2"
														>
															<BlockMath math={entry.latexContent} />
														</div>
													)}
													{entry.content && (
														<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
															{entry.content}
														</p>
													)}
													{entry.description && (
														<p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
															{entry.description}
														</p>
													)}
												</td>
												<td className="px-4 py-4">
													{entry.category && (
														<span
															className="px-2 py-1 rounded-full text-xs inline-block"
															style={{
																backgroundColor: entry.category.color
																	? `${entry.category.color}20`
																	: undefined,
																color: entry.category.color || undefined,
															}}
														>
															{entry.category.name}
														</span>
													)}
												</td>
												<td className="px-4 py-4">
													{entry.subCategory && (
														<span className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
															{entry.subCategory.name}
														</span>
													)}
												</td>
												<td className="px-4 py-4">
													<span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
														{
															entryTypes.find((t) => t.value === entry.type)
																?.label
														}
													</span>
												</td>
												<td className="px-4 py-4">
													<div className="flex flex-wrap gap-1">
														{entry.tags.slice(0, 2).map((tag, i) => (
															<span
																key={i}
																className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
															>
																#{tag}
															</span>
														))}
														{entry.tags.length > 2 && (
															<span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-500">
																+{entry.tags.length - 2}
															</span>
														)}
													</div>
												</td>
												<td className="px-4 py-4">
													<div className="flex gap-2">
														<MotionButton
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															onClick={() => toggleFavorite(entry)}
															className={`p-1.5 rounded-lg transition-colors ${
																entry.isFavorite
																	? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
																	: "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
															}`}
														>
															★
														</MotionButton>
														<MotionButton
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															onClick={() => openEditForm(entry)}
															className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
														>
															<Edit3 size={16} />
														</MotionButton>
														<MotionButton
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															onClick={() => handleDelete(entry.id)}
															disabled={deletingId === entry.id}
															className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
														>
															{deletingId === entry.id ? (
																<div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
															) : (
																<Trash2 size={16} />
															)}
														</MotionButton>
													</div>
												</td>
											</MotionTr>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						</div>

						{/* Mobile Card View */}
						<div className="lg:hidden space-y-4">
							<AnimatePresence mode="popLayout">
								{filteredEntries.map((entry, index) => (
									<MotionDiv
										key={entry.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ delay: index * 0.05 }}
										className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg"
									>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-2 flex-1">
												{entry.isFavorite && (
													<span className="text-amber-500 text-lg">⭐</span>
												)}
												<h3 className="font-bold text-gray-800 dark:text-gray-200 text-base">
													{entry.title}
												</h3>
											</div>
											<div className="flex gap-1">
												<button
													onClick={() => toggleFavorite(entry)}
													className={`p-2 rounded-lg transition-colors ${entry.isFavorite ? "text-amber-500" : "text-gray-400"}`}
												>
													★
												</button>
												<button
													onClick={() => openEditForm(entry)}
													className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg"
												>
													<Edit3 size={16} />
												</button>
												<button
													onClick={() => handleDelete(entry.id)}
													disabled={deletingId === entry.id}
													className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
												>
													{deletingId === entry.id ? (
														<div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
													) : (
														<Trash2 size={16} />
													)}
												</button>
											</div>
										</div>
										<div className="mb-3">
											{entry.latexContent && (
												<div
													dir="ltr"
													className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto mb-2"
												>
													<BlockMath math={entry.latexContent} />
												</div>
											)}
											{entry.content && (
												<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
													{entry.content}
												</p>
											)}
											{entry.description && (
												<p className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
													{entry.description}
												</p>
											)}
										</div>
										<div className="grid grid-cols-2 gap-2 mb-3 text-xs">
											<div className="flex items-center gap-1">
												<span className="text-gray-500">دسته:</span>
												{entry.category && (
													<span
														className="px-2 py-0.5 rounded-full text-xs"
														style={{
															backgroundColor: entry.category.color
																? `${entry.category.color}20`
																: undefined,
															color: entry.category.color || undefined,
														}}
													>
														{entry.category.name}
													</span>
												)}
											</div>
											<div className="flex items-center gap-1">
												<span className="text-gray-500">زیردسته:</span>
												{entry.subCategory ? (
													<span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-700">
														{entry.subCategory.name}
													</span>
												) : (
													<span className="text-gray-400">-</span>
												)}
											</div>
											<div className="flex items-center gap-1">
												<span className="text-gray-500">نوع:</span>
												<span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
													{
														entryTypes.find((t) => t.value === entry.type)
															?.label
													}
												</span>
											</div>
										</div>
										{entry.tags.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{entry.tags.map((tag, i) => (
													<span
														key={i}
														className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
													>
														#{tag}
													</span>
												))}
											</div>
										)}
									</MotionDiv>
								))}
							</AnimatePresence>
						</div>
					</MotionDiv>

					{/* Empty State */}
					{filteredEntries.length === 0 && (
						<MotionDiv
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-12 sm:py-16"
						>
							<Database
								size={48}
								className="sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400"
							/>
							<h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
								{t("messages.no_data")}
							</h3>
							<p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-6">
								{t("messages.first_data")}
							</p>
							<MotionButton
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={openCreateForm}
								className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 text-sm sm:text-base"
							>
								<Plus size={18} className="inline ml-2" />
								{t("add_new")}
							</MotionButton>
						</MotionDiv>
					)}
				</div>

				{/* Form Modal */}
				<AnimatePresence>
					{isFormOpen && (
						<MotionDiv
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
							onClick={() => setIsFormOpen(false)}
						>
							<MotionDiv
								initial={{ scale: 0.9, opacity: 0, y: 20 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.9, opacity: 0, y: 20 }}
								className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full relative top-16"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-500/10 to-purple-500/10">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
												<FolderOpen className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
											</div>
											<h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
												{editingEntry ? t("edit") : t("add_new")}
											</h2>
										</div>
										<button
											onClick={() => setIsFormOpen(false)}
											className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
										>
											<X size={18} className="sm:w-5 sm:h-5" />
										</button>
									</div>
								</div>

								<form onSubmit={saveEntry} className="p-4 sm:p-6">
									<div className="py-4 sm:py-6 px-2 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{t("form.title")}
											</label>
											<input
												type="text"
												value={formTitle}
												onChange={(e) => setFormTitle(e.target.value)}
												placeholder={t("form.title_placeholder")}
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{t("form.content")}
											</label>
											<textarea
												value={formContent}
												onChange={(e) => setFormContent(e.target.value)}
												placeholder={t("form.content_placeholder")}
												rows={3}
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{t("form.latex")}
											</label>
											<input
												type="text"
												value={formLatex}
												onChange={(e) => setFormLatex(e.target.value)}
												placeholder="\\sin(30^\\circ) = \\frac{1}{2}"
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs sm:text-sm"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{t("form.description")}
											</label>
											<textarea
												value={formDescription}
												onChange={(e) => setFormDescription(e.target.value)}
												placeholder="..."
												rows={2}
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
											/>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
													{t("form.category")}
												</label>
												<select
													value={formCategoryId}
													onChange={(e) => {
														setFormCategoryId(e.target.value);
														setFormSubCategoryId("");
													}}
													className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
													required
												>
													<option value="">{t("form.select")}</option>
													{categories.map((cat) => (
														<option key={cat.id} value={cat.id}>
															{cat.name}
														</option>
													))}
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
													{t("form.type")}
												</label>
												<select
													value={formType}
													onChange={(e) => setFormType(e.target.value)}
													className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
												>
													{entryTypes.map((type) => (
														<option key={type.value} value={type.value}>
															{type.label}
														</option>
													))}
												</select>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
													{t("form.subcategory")}
												</label>
												<select
													value={formSubCategoryId}
													onChange={(e) => setFormSubCategoryId(e.target.value)}
													className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
													disabled={!formCategoryId}
												>
													<option value="">{t("form.select")}</option>
													{subCategories
														.filter((s) => s.categoryId === formCategoryId)
														.map((sub) => (
															<option key={sub.id} value={sub.id}>
																{sub.name}
															</option>
														))}
												</select>
											</div>
											<div className="flex items-center">
												<label className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={formIsFavorite}
														onChange={(e) =>
															setFormIsFavorite(e.target.checked)
														}
														className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
													/>
													<span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
														⭐ {t("form.favorite")}
													</span>
												</label>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												{t("form.tags")}
											</label>
											<input
												type="text"
												value={formTags}
												onChange={(e) => setFormTags(e.target.value)}
												placeholder={t("form.tags_placeholder")}
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
											/>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row gap-3 pt-4">
										<MotionButton
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											type="submit"
											disabled={submitting}
											className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-60 text-sm sm:text-base"
										>
											{submitting ? (
												<>
													<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block ml-2" />{" "}
													{t("form.saving")}
												</>
											) : editingEntry ? (
												t("edit")
											) : (
												t("form.save")
											)}
										</MotionButton>
										<MotionButton
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											type="button"
											onClick={() => setIsFormOpen(false)}
											className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all font-semibold text-sm sm:text-base"
										>
											{t("form.cancel")}
										</MotionButton>
									</div>
								</form>
							</MotionDiv>
						</MotionDiv>
					)}
				</AnimatePresence>

				{/* Toast Notification */}
				<AnimatePresence>
					{response && (
						<MotionDiv
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							className={`fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-lg z-100 ${
								response.type === "success"
									? "bg-green-50/90 dark:bg-green-900/90 text-green-800 dark:text-green-200"
									: response.type === "error"
										? "bg-red-50/90 dark:bg-red-900/90 text-red-800 dark:text-red-200"
										: "bg-blue-50/90 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200"
							}`}
						>
							<div className="flex items-center gap-2 sm:gap-3">
								{response.type === "success" ? (
									<CheckCircle className="text-green-600 dark:text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
								) : response.type === "error" ? (
									<AlertCircle className="text-red-600 dark:text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
								) : (
									<Database className="text-blue-600 dark:text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
								)}
								<span className="flex-1 font-semibold text-xs sm:text-sm">
									{response.text}
								</span>
								<button
									onClick={() => {
										if (timeoutRef.current) clearTimeout(timeoutRef.current);
										setResponse(null);
									}}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold text-base sm:text-lg leading-none p-1"
								>
									<X size={14} className="sm:w-[18px] sm:h-[18px]" />
								</button>
							</div>
						</MotionDiv>
					)}
				</AnimatePresence>

				{/* Delete Confirm Modal */}
				<ConfirmModal
					isOpen={deleteModalOpen}
					onCancel={() => {
						setDeleteModalOpen(false);
						setToDeleteId(null);
					}}
					onConfirm={confirmDelete}
					message={t("messages.confirm_delete")}
					confirmText={t("columns.actions") || "Delete"}
					confirmColor="bg-red-600 hover:bg-red-700"
				/>
			</div>
		</>
	);
}
