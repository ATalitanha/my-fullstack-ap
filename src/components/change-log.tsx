"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { getChangeLogs } from "@/lib/db";
import { AnimatePresence, motion } from "framer-motion";

type ChangeLogProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function ChangeLog({ isOpen, onClose }: ChangeLogProps) {
	const [changeLogs, setChangeLogs] = useState<
		{ version: string; changes: string[] }[]
	>([]);
	const [expandedItem, setExpandedItem] = useState<string | null>(null);

	useEffect(() => {
		setChangeLogs(getChangeLogs);
	}, []);

	const handleAccordionChange = (value: string) => {
		setExpandedItem(expandedItem === value ? null : value);
	};

	const textVariants = {
		hidden: { opacity: 0 },
		visible: (i: number) => ({
			opacity: 1,
			transition: { delay: i * 0.1 },
		}),
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						dir="ltr"
						className="relative w-full max-w-md max-h-[50vh] m-4 overflow-auto bg-white rounded-lg shadow-lg dark:bg-gray-950 dark:text-white scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70 scrollbar-thumb-rounded scrollbar-track-transparent hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80 transition-all"
						initial={{ y: 50, opacity: 0, scale: 0.9 }}
						animate={{ y: 0, opacity: 1, scale: 1 }}
						exit={{ y: 50, opacity: 0, scale: 0.9 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
					>
						<div className="sticky top-0 z-10 flex items-center justify-between w-full p-4 bg-white border-b dark:bg-gray-950 dark:border-gray-800">
							<motion.h2
								className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								Change Log
							</motion.h2>
							<motion.button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								whileHover={{ scale: 1.2, rotate: 90 }}
								transition={{ type: "spring", stiffness: 300, damping: 15 }}
							>
								<X className="w-5 h-5 cursor-pointer" />
							</motion.button>
						</div>
						<div className="w-full p-6" dir="rtl">
							{changeLogs.map((log, index) => (
								<motion.div
									key={index}
									className="px-3 border-b last:border-b-0"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * index }}
									whileHover={{
										backgroundColor: "rgba(0, 0, 0, 0.03)",
										transition: { duration: 0.2 },
									}}
								>
									<div
										className="flex items-center justify-between py-4 text-xl cursor-pointer"
										onClick={() => handleAccordionChange(`item-${index}`)}
									>
										<span className="font-medium text-black dark:text-gray-100">
											Version {log.version}
										</span>
										<motion.div
											animate={{
												rotate: expandedItem === `item-${index}` ? 180 : 0,
											}}
											transition={{ duration: 0.3 }}
										>
											<ChevronDown />
										</motion.div>
									</div>
									<AnimatePresence>
										{expandedItem === `item-${index}` && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="overflow-hidden"
											>
												<div className="px-1 pb-4">
													<ul className="pl-5 space-y-1 list-disc">
														{log.changes.map(
															(change, changeIndex) =>
																change && (
																	<motion.li
																		key={changeIndex}
																		className="text-gray-800 dark:text-gray-400"
																		custom={changeIndex}
																		initial="hidden"
																		animate="visible"
																		variants={textVariants}
																	>
																		- {change}
																	</motion.li>
																),
														)}
													</ul>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							))}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
