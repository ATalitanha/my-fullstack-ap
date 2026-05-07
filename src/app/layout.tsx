import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import A11yAnnouncer from "@/components/providers/A11yAnnouncer";
import PageTransition from "@/components/providers/PageTransition";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Header from "@/components/ui/header";
import { LanguageProvider } from "@/constants/LanguageContext";
import theme from "@/lib/theme";
import HybridLoading from "./loading";

export const metadata: Metadata = {
  title: "tanha app",
  description: "Accessible, performant, and integrated modern frontend",
  applicationName: "tanha app",
  keywords: [
    "Next.js",
    "Radix UI",
    "GSAP",
    "shadcn",
    "Tailwind",
    "WCAG",
    "SEO",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "tanha app",
    description: "Accessible, performant, and integrated modern frontend",
    type: "website",
    locale: "fa_IR",
    siteName: "tanha app",
  },
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
      <body
        className={`antialiased 
          ${theme}`}
      >
        <LanguageProvider>
          <Header />
          <PageTransition />
          <ThemeProvider />
          <A11yAnnouncer />
          <main id="main">
            <Suspense fallback={<HybridLoading />}>{children}</Suspense>
          </main>

          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
