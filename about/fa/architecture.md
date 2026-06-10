# معماری و ساختار پروژه TanhaApp

این سند دیدی کلی از معماری و ساختار پوشه‌بندی پروژه TanhaApp ارائه می‌دهد.

## ساختار پوشه‌بندی

- `/src`: کد منبع اصلی اپلیکیشن.
  - `/app`: مسیرهای Next.js (App Router). هر زیرپوشه یک صفحه یا یک API route را تعریف می‌کند.
  - `/components`: کامپوننت‌های React با قابلیت استفاده مجدد.
  - `/constants`: مقادیر ثابت و Contextهای اپلیکیشن (مانند LanguageContext).
  - `/dictionaries`: فایل‌های JSON شامل ترجمه‌های فارسی (`fa.json`) و انگلیسی (`en.json`).
  - `/features`: منطق‌های خاص برای ویژگی‌های مختلف اپلیکیشن.
  - `/hooks`: هوک‌های سفارشی React (مانند `useTranslation`).
  - `/lib`: توابع کمکی و تنظیمات کتابخانه‌ها (مانند Prisma و تنظیمات تم).
  - `/shared`: کامپوننت‌ها و هوک‌های مشترک بین بخش‌های مختلف.
  - `/types`: تعاریف TypeScript.
- `/prisma`: شمای پایگاه داده و میگریشن‌های Prisma.
- `/public`: دارایی‌های استاتیک مانند تصاویر و فونت‌ها.
- `/docs`: مستندات فنی اضافی.

## تکنولوژی‌های مورد استفاده

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Internationalization**: پیاده‌سازی اختصاصی با استفاده از React Context
- **Icons**: Lucide React & React Icons
- **Validation**: Zod (برای APIها)

## الگوهای طراحی

1. **Feature-based Architecture**: کدها بر اساس ویژگی تقسیم‌بندی شده‌اند تا مقیاس‌پذیری و نگهداری آسان‌تر باشد.
2. **Custom i18n Hook**: استفاده از هوک `useTranslation` برای دسترسی آسان به ترجمه‌ها در تمام کامپوننت‌های کلاینت.
3. **Responsive Design**: استفاده از ابزارهای Tailwind برای اطمینان از نمایش درست در تمام دستگاه‌ها.
4. **Glassmorphism**: استفاده از افکت‌های شیشه‌ای و Blur در طراحی UI (Linear.app style).
