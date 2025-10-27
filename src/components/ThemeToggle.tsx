"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * A component that allows the user to switch between light and dark themes.
 * The selected theme is persisted in local storage.
 * @returns {JSX.Element} The theme toggle button.
 */
const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("theme");
		const preferDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const shouldUseDark = saved ? saved === "dark" : preferDark;

		document.documentElement.classList.toggle("dark", shouldUseDark);
		setIsDark(shouldUseDark);
	}, []);

	const toggle = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);
		document.documentElement.classList.toggle("dark", newTheme);
		localStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	return (
		<button
			onClick={toggle}
			title="تغییر تم"
			className="flex items-center justify-center p-2 transition-colors rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-700"
		>
			{isDark ? (
				<Moon className="w-5 h-5 text-gray-200" />
			) : (
				<Sun className="w-5 h-5 text-yellow-400" />
			)}
		</button>
	);
};

export default ThemeToggle;
