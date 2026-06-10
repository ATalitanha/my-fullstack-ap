// biome-ignore-all lint/a11y/noLabelWithoutControl: <>
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
// biome-ignore-all lint/a11y/useButtonType: <>
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Book,
	Calculator,
	Code,
	Database,
	Edit3,
	FlaskRound,
	Folder,
	FolderOpen,
	FolderPlus,
	Heart,
	Plus,
	Settings,
	Star,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";

// نقشه آیکون‌ها برای نمایش
const iconComponents: Record<string, any> = {
	Folder: Folder,
	FolderOpen: FolderOpen,
	Database: Database,
	Calculator: Calculator,
	Flask: FlaskRound,
	Book: Book,
	Code: Code,
	Star: Star,
	Heart: Heart,
	Tag: Tag,
};

// کامپوننت برای رندر آیکون
const IconRenderer = ({
	iconName,
	className,
}: {
	iconName: string;
	className?: string;
}) => {
	const IconComponent = iconComponents[iconName];
	if (!IconComponent) {
		return <span className={className}>{iconName}</span>;
	}
	return <IconComponent className={className} />;
};

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
	_count?: { entries: number };
};

interface CategoryManagerProps {
	categories: Category[];
	subCategories: SubCategory[];
	onRefresh: () => void;
}

export default function CategoryManager({
	categories,
	subCategories,
	onRefresh,
}: CategoryManagerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"categories" | "subcategories">(
		"categories",
	);

	// Category form
	const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [categoryName, setCategoryName] = useState("");
	const [categoryDescription, setCategoryDescription] = useState("");
	const [categoryColor, setCategoryColor] = useState("#3B82F6");
	const [categoryIcon, setCategoryIcon] = useState("Folder");

	// SubCategory form
	const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
	const [editingSubCategory, setEditingSubCategory] =
		useState<SubCategory | null>(null);
	const [subCategoryName, setSubCategoryName] = useState("");
	const [subCategoryDescription, setSubCategoryDescription] = useState("");
	const [subCategoryColor, setSubCategoryColor] = useState("#10B981");
	const [subCategoryIcon, setSubCategoryIcon] = useState("FolderOpen");
	const [subCategoryParentId, setSubCategoryParentId] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const colorOptions = [
		"#3B82F6", // Blue
		"#10B981", // Green
		"#EF4444", // Red
		"#F59E0B", // Amber
		"#8B5CF6", // Purple
		"#EC4899", // Pink
		"#06B6D4", // Cyan
		"#F97316", // Orange
	];

	const iconOptions = [
		"Folder",
		"FolderOpen",
		"Database",
		"Calculator",
		"Flask",
		"Book",
		"Code",
		"Star",
		"Heart",
		"Tag",
	];

	// Reset category form
	const resetCategoryForm = () => {
		setCategoryName("");
		setCategoryDescription("");
		setCategoryColor("#3B82F6");
		setCategoryIcon("Folder");
		setEditingCategory(null);
	};

	// Reset subcategory form
	const resetSubCategoryForm = () => {
		setSubCategoryName("");
		setSubCategoryDescription("");
		setSubCategoryColor("#10B981");
		setSubCategoryIcon("FolderOpen");
		setSubCategoryParentId("");
		setEditingSubCategory(null);
	};

	// Open edit category
	const openEditCategory = (category: Category) => {
		setEditingCategory(category);
		setCategoryName(category.name);
		setCategoryDescription(category.description || "");
		setCategoryColor(category.color || "#3B82F6");
		setCategoryIcon(category.icon || "Folder");
		setIsCategoryFormOpen(true);
	};

	// Open edit subcategory
	const openEditSubCategory = (subCategory: SubCategory) => {
		setEditingSubCategory(subCategory);
		setSubCategoryName(subCategory.name);
		setSubCategoryDescription(subCategory.description || "");
		setSubCategoryColor(subCategory.color || "#10B981");
		setSubCategoryIcon(subCategory.icon || "FolderOpen");
		setSubCategoryParentId(subCategory.categoryId);
		setIsSubCategoryFormOpen(true);
	};

	// Save category
	const saveCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!categoryName.trim()) return;

		setSubmitting(true);
		try {
			const url = editingCategory
				? `/api/data-repo/categories/${editingCategory.id}`
				: "/api/data-repo/categories";
			const method = editingCategory ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: categoryName,
					description: categoryDescription || undefined,
					color: categoryColor,
					icon: categoryIcon,
				}),
			});

			if (res.ok) {
				setIsCategoryFormOpen(false);
				resetCategoryForm();
				onRefresh();
			}
		} catch (error) {
			console.error("Error saving category:", error);
		} finally {
			setSubmitting(false);
		}
	};

	// Save subcategory
	const saveSubCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!subCategoryName.trim() || !subCategoryParentId) return;

		setSubmitting(true);
		try {
			const url = editingSubCategory
				? `/api/data-repo/subcategories/${editingSubCategory.id}`
				: "/api/data-repo/subcategories";
			const method = editingSubCategory ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: subCategoryName,
					description: subCategoryDescription || undefined,
					color: subCategoryColor,
					icon: subCategoryIcon,
					categoryId: subCategoryParentId,
				}),
			});

			if (res.ok) {
				setIsSubCategoryFormOpen(false);
				resetSubCategoryForm();
				onRefresh();
			}
		} catch (error) {
			console.error("Error saving subcategory:", error);
		} finally {
			setSubmitting(false);
		}
	};

	// Delete subcategory (categories cannot be deleted)
	const deleteSubCategory = async (id: string) => {
		if (!confirm("آیا از حذف این زیردسته اطمینان دارید؟")) return;

		setDeletingId(id);
		try {
			const res = await fetch(`/api/data-repo/subcategories/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				onRefresh();
			}
		} catch (error) {
			console.error("Error deleting subcategory:", error);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<>
			{/* Manager Button - Responsive */}
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsOpen(true)}
				className="px-3 sm:px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-all flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
			>
				<Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
				<span className="">مدیریت دسته‌بندی‌ها</span>
			</motion.button>

			{/* Manager Modal - Responsive */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsOpen(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden mx-2"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header - Responsive */}
							<div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-500/10 to-purple-500/10">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 sm:gap-3">
										<div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
											<FolderPlus className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
										</div>
										<h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
											مدیریت دسته‌بندی‌ها
										</h2>
									</div>
									<button
										onClick={() => setIsOpen(false)}
										className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
									>
										<X size={18} className="sm:w-5 sm:h-5" />
									</button>
								</div>
							</div>

							{/* Tabs - Responsive */}
							<div className="flex border-b border-gray-200 dark:border-gray-700">
								<button
									onClick={() => setActiveTab("categories")}
									className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium transition-colors text-sm sm:text-base ${
										activeTab === "categories"
											? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
									}`}
								>
									دسته‌بندی‌های اصلی
								</button>
								<button
									onClick={() => setActiveTab("subcategories")}
									className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium transition-colors text-sm sm:text-base ${
										activeTab === "subcategories"
											? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
									}`}
								>
									زیردسته‌ها
								</button>
							</div>

							{/* Content - Responsive */}
							<div
								className="p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
                scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent 
              hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 max-h-[55vh] sm:max-h-[60vh]"
							>
								{activeTab === "categories" ? (
									<div className="space-y-4">
										<div className="flex justify-end">
											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onClick={() => {
													resetCategoryForm();
													setIsCategoryFormOpen(true);
												}}
												className="px-3 sm:px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
											>
												<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
												<span className="hidden xs:inline">دسته‌بندی جدید</span>
												<span className="xs:hidden">جدید</span>
											</motion.button>
										</div>

										<div className="grid gap-3">
											{categories.map((category) => (
												<div
													key={category.id}
													className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 gap-3"
												>
													<div className="flex items-center gap-3">
														<div
															className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white shrink-0"
															style={{
																backgroundColor: category.color || "#3B82F6",
															}}
														>
															<IconRenderer
																iconName={category.icon || "Folder"}
																className="w-4 h-4 sm:w-5 sm:h-5"
															/>
														</div>
														<div className="flex-1 min-w-0">
															<h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
																{category.name}
															</h3>
															{category.description && (
																<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
																	{category.description}
																</p>
															)}
															<div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs text-gray-500">
																<span>
																	📊 {category._count?.entries || 0} داده
																</span>
																<span>
																	📁 {category._count?.subCategories || 0}{" "}
																	زیردسته
																</span>
															</div>
														</div>
													</div>
													<button
														onClick={() => openEditCategory(category)}
														className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors self-end sm:self-center"
													>
														<Edit3
															size={16}
															className="sm:w-[18px] sm:h-[18px]"
														/>
													</button>
												</div>
											))}
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="flex justify-end">
											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onClick={() => {
													resetSubCategoryForm();
													setIsSubCategoryFormOpen(true);
												}}
												className="px-3 sm:px-4 py-2 rounded-xl bg-linear-to-r from-green-600 to-teal-600 text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
											>
												<Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
												<span className="hidden xs:inline">زیردسته جدید</span>
												<span className="xs:hidden">جدید</span>
											</motion.button>
										</div>

										<div className="grid gap-3">
											{subCategories.map((subCategory) => {
												const parent = categories.find(
													(c) => c.id === subCategory.categoryId,
												);
												return (
													<div
														key={subCategory.id}
														className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 gap-3"
													>
														<div className="flex items-center gap-3">
															<div
																className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white shrink-0"
																style={{
																	backgroundColor:
																		subCategory.color || "#10B981",
																}}
															>
																<IconRenderer
																	iconName={subCategory.icon || "FolderOpen"}
																	className="w-4 h-4 sm:w-5 sm:h-5"
																/>
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex flex-wrap items-center gap-2">
																	<h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
																		{subCategory.name}
																	</h3>
																	{parent && (
																		<span
																			className="px-1.5 sm:px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
																			style={{
																				backgroundColor: parent.color
																					? `${parent.color}20`
																					: undefined,
																				color: parent.color || undefined,
																			}}
																		>
																			{parent.name}
																		</span>
																	)}
																</div>
																{subCategory.description && (
																	<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
																		{subCategory.description}
																	</p>
																)}
																<div className="text-xs text-gray-500 mt-1">
																	📊 {subCategory._count?.entries || 0} داده
																</div>
															</div>
														</div>
														<div className="flex gap-1 self-end sm:self-center">
															<button
																onClick={() => openEditSubCategory(subCategory)}
																className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
															>
																<Edit3
																	size={16}
																	className="sm:w-[18px] sm:h-[18px]"
																/>
															</button>
															<button
																onClick={() =>
																	deleteSubCategory(subCategory.id)
																}
																disabled={deletingId === subCategory.id}
																className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
															>
																{deletingId === subCategory.id ? (
																	<div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
																) : (
																	<Trash2
																		size={16}
																		className="sm:w-[18px] sm:h-[18px]"
																	/>
																)}
															</button>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Category Form Modal - Responsive */}
			<AnimatePresence>
				{isCategoryFormOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm "
						onClick={() => setIsCategoryFormOpen(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-2 relative top-2"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
								<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
									{editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
								</h3>
							</div>

							<form onSubmit={saveCategory} className="p-4 sm:p-6">
								<div
									className="px-2 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
              scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent 
            hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80"
								>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											نام دسته‌بندی *
										</label>
										<input
											type="text"
											value={categoryName}
											onChange={(e) => setCategoryName(e.target.value)}
											placeholder="مثال: ریاضیات"
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											توضیحات
										</label>
										<textarea
											value={categoryDescription}
											onChange={(e) => setCategoryDescription(e.target.value)}
											placeholder="توضیحات اختیاری..."
											rows={2}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											رنگ
										</label>
										<div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
											{colorOptions.map((color) => (
												<button
													key={color}
													type="button"
													onClick={() => setCategoryColor(color)}
													className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all ${
														categoryColor === color
															? "ring-2 ring-offset-2 ring-blue-500 scale-110"
															: ""
													}`}
													style={{ backgroundColor: color }}
												/>
											))}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											آیکون
										</label>
										<div className="grid grid-cols-3 xs:grid-cols-5 gap-2">
											{iconOptions.map((icon) => {
												const IconComponent = iconComponents[icon];
												return (
													<button
														key={icon}
														type="button"
														onClick={() => setCategoryIcon(icon)}
														className={`p-1.5 sm:p-2 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
															categoryIcon === icon
																? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500"
																: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
														}`}
													>
														{IconComponent && (
															<IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
														)}
														<span className="text-[10px] sm:text-xs">
															{icon}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 pt-4">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={submitting}
										className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg disabled:opacity-60 text-sm sm:text-base"
									>
										{submitting
											? "در حال ذخیره..."
											: editingCategory
												? "بروزرسانی"
												: "ایجاد"}
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="button"
										onClick={() => {
											setIsCategoryFormOpen(false);
											resetCategoryForm();
										}}
										className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base"
									>
										انصراف
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* SubCategory Form Modal - Responsive */}
			<AnimatePresence>
				{isSubCategoryFormOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsSubCategoryFormOpen(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-2 relative top-2"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
								<h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
									{editingSubCategory ? "ویرایش زیردسته" : "زیردسته جدید"}
								</h3>
							</div>

							<form onSubmit={saveSubCategory} className="p-4 sm:p-6 ">
								<div
									className="py-4 sm:py-6 px-2 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
              scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent 
            hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80"
								>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											دسته‌بندی والد *
										</label>
										<select
											value={subCategoryParentId}
											onChange={(e) => setSubCategoryParentId(e.target.value)}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
											required
										>
											<option value="">انتخاب کنید</option>
											{categories.map((cat) => (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											نام زیردسته *
										</label>
										<input
											type="text"
											value={subCategoryName}
											onChange={(e) => setSubCategoryName(e.target.value)}
											placeholder="مثال: مثلثات"
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											توضیحات
										</label>
										<textarea
											value={subCategoryDescription}
											onChange={(e) =>
												setSubCategoryDescription(e.target.value)
											}
											placeholder="توضیحات اختیاری..."
											rows={2}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm sm:text-base"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											رنگ
										</label>
										<div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
											{colorOptions.map((color) => (
												<button
													key={color}
													type="button"
													onClick={() => setSubCategoryColor(color)}
													className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all ${
														subCategoryColor === color
															? "ring-2 ring-offset-2 ring-blue-500 scale-110"
															: ""
													}`}
													style={{ backgroundColor: color }}
												/>
											))}
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-3 pt-4">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={submitting}
										className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-green-600 to-teal-600 text-white shadow-lg disabled:opacity-60 text-sm sm:text-base"
									>
										{submitting
											? "در حال ذخیره..."
											: editingSubCategory
												? "بروزرسانی"
												: "ایجاد"}
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="button"
										onClick={() => {
											setIsSubCategoryFormOpen(false);
											resetSubCategoryForm();
										}}
										className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base"
									>
										انصراف
									</motion.button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
