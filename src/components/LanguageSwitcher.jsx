// components/LanguageSwitcher.js
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/constants/LanguageContext"; // اصلاح مسیر

// آیکون‌ها را با dynamic import بارگیری کن
const Globe = dynamic(() => import("lucide-react").then((mod) => mod.Globe), {
	ssr: false,
	loading: () => (
		<div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
	),
});
const ChevronDown = dynamic(
	() => import("lucide-react").then((mod) => mod.ChevronDown),
	{
		ssr: false,
		loading: () => (
			<div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
		),
	},
);
const Check = dynamic(() => import("lucide-react").then((mod) => mod.Check), {
	ssr: false,
	loading: () => (
		<div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
	),
});

export default function LanguageSwitcher({
	variant = "dropdown",
	size = "md",
	showNames = true,
	showFlags = true,
	className = "",
	mobileAdaptive = true,
}) {
	const { language, changeLanguage, supportedLanguages, isLoading } =
		useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// بستن dropdown با کلیک بیرون
	useEffect(() => {
		if (!isMounted) return;

		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMounted]);

	const handleLanguageChange = async (langCode) => {
		await changeLanguage(langCode);
		setIsOpen(false);
	};

	if (!isMounted || isLoading) {
		return (
			<div className="inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
				<div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
				<div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
			</div>
		);
	}

	// استایل‌های Tailwind بر اساس size
	const getSizeClasses = () => {
		switch (size) {
			case "sm":
				return {
					button: "px-2 py-1 text-sm",
					icon: "w-4 h-4",
					flag: "text-xs",
					name: "text-xs",
					dropdown: "min-w-[120px]",
					item: "px-2 py-1.5",
				};
			case "lg":
				return {
					button: "px-4 py-2 text-lg",
					icon: "w-6 h-6",
					flag: "text-base",
					name: "text-base",
					dropdown: "min-w-[160px]",
					item: "px-4 py-2.5",
				};
			default: // md
				return {
					button: "px-3 py-1.5 text-base",
					icon: "w-5 h-5",
					flag: "text-sm",
					name: "text-sm",
					dropdown: "min-w-[140px]",
					item: "px-3 py-2",
				};
		}
	};

	const sizeClasses = getSizeClasses();

	// استایل‌های واکنش‌گرا برای موبایل
	const getResponsiveClasses = () => {
		if (!mobileAdaptive) return "";

		return `
      max-sm:px-2 max-sm:py-1
      max-sm:text-sm
      max-sm:[&_svg]:w-4 max-sm:[&_svg]:h-4
    `;
	};

	const currentLang = supportedLanguages.find((lang) => lang.code === language);

	// حالت دکمه‌ای
	if (variant === "buttons") {
		return (
			<div className={`flex items-center gap-1 ${className}`}>
				{supportedLanguages.map((lang) => (
					<button
						key={lang.code}
						onClick={() => handleLanguageChange(lang.code)}
						className={`
              flex items-center justify-center
              ${sizeClasses.button}
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              rounded-md
              transition-all duration-200
              hover:bg-gray-50 dark:hover:bg-gray-700
              hover:border-gray-400 dark:hover:border-gray-600
              focus:outline-none
              ${
								language === lang.code
									? "bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700 hover:bg-blue-700 hover:border-blue-700"
									: "text-gray-700 dark:text-gray-300"
							}
              ${getResponsiveClasses()}
            `}
						aria-label={`Switch to ${lang.name}`}
						title={lang.name}
					>
						{showFlags && (
							<span className={`mr-1 ${sizeClasses.flag}`}>
								{lang.code === "fa" ? "🇮🇷" : "🇺🇸"}
							</span>
						)}
						{showNames ? lang.code.toUpperCase() : ""}
					</button>
				))}
			</div>
		);
	}

	// حالت select ساده
	if (variant === "select") {
		return (
			<select
				value={language}
				onChange={(e) => handleLanguageChange(e.target.value)}
				className={`
          ${sizeClasses.button}
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-lg
          text-gray-700 dark:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${getResponsiveClasses()}
          ${className}
        `}
				aria-label="Select language"
			>
				{supportedLanguages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{showFlags ? `${lang.code === "fa" ? "🇮🇷" : "🇺🇸"} ` : ""}
						{showNames ? lang.name : lang.code.toUpperCase()}
					</option>
				))}
			</select>
		);
	}

	// حالت dropdown (پیش‌فرض)
	return (
		<div className={`relative inline-block ${className}`} ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-haspopup="true"
				aria-label="Language switcher"
				className={`
          flex items-center justify-between gap-2
          ${sizeClasses.button}
          bg-white dark:bg-gray-800
          rounded-lg
          text-gray-700 dark:text-gray-300
          transition-all duration-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          hover:border-gray-400 dark:hover:border-gray-600
          focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700
          ${getResponsiveClasses()}
        `}
			>
				<div className="flex items-center gap-2">
					<Globe className={sizeClasses.icon} />
					<span className="font-medium whitespace-nowrap">
						{showNames
							? currentLang?.name
							: (showFlags
									? `${currentLang?.code === "fa" ? "🇮🇷" : "🇺🇸"} `
									: "") + currentLang?.code.toUpperCase()}
					</span>
				</div>
				<ChevronDown
					className={`${sizeClasses.icon} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div
					className={`
            absolute ${size === "sm" ? "top-9" : size === "lg" ? "top-11" : "top-10"}
            right-0 z-50
            ${sizeClasses.dropdown}
            bg-white dark:bg-gray-800
            rounded-sm shadow-lg
            overflow-hidden
            animate-in fade-in-0 zoom-in-95
          `}
					role="menu"
				>
					{supportedLanguages.map((lang) => (
						<button
							key={lang.code}
							onClick={() => handleLanguageChange(lang.code)}
							className={`
                flex items-center justify-between w-full
                ${sizeClasses.item}
                text-left
                transition-colors duration-150
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                ${
									language === lang.code
										? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
										: "text-gray-700 dark:text-gray-300"
								}
              `}
							role="menuitem"
						>
							<div className="flex items-center gap-2">
								{showFlags && (
									<span className={`font-bold ${sizeClasses.flag}`}>
										{lang.code === "fa" ? "🇮🇷" : "🇺🇸"}
									</span>
								)}
								<div className="flex flex-col items-start">
									<span className={`font-medium ${sizeClasses.name}`}>
										{lang.name}
									</span>
									{showNames && (
										<span
											className={`text-gray-500 dark:text-gray-400 ${sizeClasses.flag}`}
										>
											{lang.code.toUpperCase()} • {lang.locale}
										</span>
									)}
								</div>
							</div>
							{language === lang.code && (
								<Check
									className={`${sizeClasses.icon} text-blue-600 dark:text-blue-400`}
								/>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// کامپوننت ساده برای استفاده در موبایل
export function SimpleLanguageSwitcher({ className = "" }) {
	const { language, changeLanguage, supportedLanguages } = useLanguage();

	return (
		<div className={`flex items-center  ${className}`}>
			{supportedLanguages.map((lang) => (
				<button
					key={lang.code}
					onClick={() => changeLanguage(lang.code)}
					className={`
            px-2 py-1 text-sm  transition-all
            ${
							language === lang.code
								? "bg-blue-600 text-white"
								: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
						}
              ${
								lang.code === "fa"
									? "rounded-r-md text-sm"
									: "rounded-l-md max-sm:text-xs "
							}
            max-sm:px-1.5 max-sm:py-0.5  w-7 h-7  flex items-center justify-center
          `}
					aria-label={lang.name}
					title={lang.name}
				>
					{lang.code === "fa" ? "فا" : "EN"}
				</button>
			))}
		</div>
	);
}

// کامپوننت مخصوص هدر
export function HeaderLanguageSwitcher() {
	const { language, changeLanguage, supportedLanguages } = useLanguage();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
				<div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
				<div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
			</div>
		);
	}

	return (
		<>
			{/* دسکتاپ */}
			<div className="hidden lg:block">
				<LanguageSwitcher
					variant="dropdown"
					size="sm"
					showNames={false}
					showFlags={true}
					className="border-gray-300 dark:border-gray-600"
				/>
			</div>

			{/* موبایل */}
			<div className="lg:hidden">
				<SimpleLanguageSwitcher />
			</div>
		</>
	);
}
