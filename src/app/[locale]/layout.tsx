import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import '../globals.css';
import theme from '@/lib/theme';
import '@fontsource/major-mono-display';
import { Analytics } from '@vercel/analytics/next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = params;
  const messages = await getMessages();
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale}
      dir={dir}
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
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
