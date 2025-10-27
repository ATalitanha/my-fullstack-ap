import type { Metadata } from "next";
import "./globals.css";
import theme from "@/lib/theme";
import { Major_Mono_Display } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next";

const majorMonoDisplay = Major_Mono_Display({
  subsets: ['latin'],
  weight: ['400'],
});

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: {
			template: "%s | Tanha App",
			default: "Tanha App",
		},
		description:
			"A collection of useful tools to improve your daily productivity.",
		keywords: ["productivity", "tools", "next.js", "react"],
		authors: [{ name: "Your Name" }],
		themeColor: "#ffffff",
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className="scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
        scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent 
        hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
      "
		>
			<body
				className={`antialiased
          ${theme} ${majorMonoDisplay.className}`}
			>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
