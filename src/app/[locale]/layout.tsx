import type { Metadata } from "next";
import "../globals.css";
import theme from "@/lib/theme";
import "@fontsource/major-mono-display";
import { Analytics } from "@vercel/analytics/next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { getMessages } from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}): Promise<Metadata> {
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({locale, messages});

  return {
    title: t('HomePage.title'),
    description: t('HomePage.description')
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className="scrollbar-thin scrollbar-thumb-blue-600/80 dark:scrollbar-thumb-blue-400/70
        scrollbar-thumb-rounded scrollbar-track-gray-100 dark:scrollbar-track-transparent
        hover:scrollbar-thumb-blue-500/90 dark:hover:scrollbar-thumb-blue-500/80
      "
    >
      <body
        className={`antialiased
          ${theme}`
        }
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="absolute top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
