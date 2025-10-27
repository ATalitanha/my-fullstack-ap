import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: {
			template: "%s | اپلیکیشن تنها",
			default: "اپلیکیشن تنها",
		},
		description:
			"مجموعه‌ای از ابزارهای مفید برای بهبود بهره‌وری روزانه شما.",
		keywords: ["بهره‌وری", "ابزارها", "next.js", "react"],
		authors: [{ name: "Your Name" }],
	};
}

export const viewport: Viewport = {
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="fa"
			dir="rtl"
			className="scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
        scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent 
        hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
      "
		>
			<body className="antialiased">
				{children}
				<Analytics />
			</body>
		</html>
	);
}
