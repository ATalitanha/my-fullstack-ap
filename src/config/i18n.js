// config/i18n.js

/**
 * @type {Object} I18nConfig
 * @property {string} defaultLocale
 * @property {string[]} locales
 * @property {Object} languages
 * @property {Object} seo
 * @property {Object} formatting
 */

export const i18nConfig = {
  // تنظیمات اصلی
  defaultLocale: 'fa',
  locales: ['fa', 'en'],
  
  // تنظیمات هر زبان
  languages: {
    fa: {
      name: 'فارسی',
      nativeName: 'فارسی',
      dir: 'rtl',
      locale: 'fa-IR',
      fontFamily: "'Vazirmatn', 'Vazir', 'Tanha', 'sans-serif'", // اضافه کردن فونت‌های fallback
      fontScale: 0.95,
      direction: 'rtl',
      textAlign: 'right',
    },
    en: {
      name: 'English',
      nativeName: 'English',
      dir: 'ltr',
      locale: 'en-US',
      fontFamily: "'Inter', 'Roboto', 'Arial', 'sans-serif'",
      fontScale: 1,
      direction: 'ltr',
      textAlign: 'left',
    },
  },
  
  // تنظیمات SEO
  seo: {
    defaultTitle: 'سایت دو زبانه',
    defaultDescription: 'توضیحات پیش‌فرض سایت',
    siteUrl: 'https://example.com',
    // اضافه کردن تنظیمات Open Graph
    openGraph: {
      type: 'website',
      siteName: 'سایت دو زبانه',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'تصویر پیش‌فرض سایت',
        },
      ],
    },
    // اضافه کردن تنظیمات Twitter
    twitter: {
      cardType: 'summary_large_image',
      handle: '@example',
      site: '@example',
    },
  },
  
  // تنظیمات فرمت‌دهی
  formatting: {
    date: {
      fa: {
        calendar: 'persian',
        digits: 'fa',
        timeZone: 'Asia/Tehran',
        firstDayOfWeek: 6, // شنبه
      },
      en: {
        calendar: 'gregory',
        digits: 'latn',
        timeZone: 'UTC',
        firstDayOfWeek: 1, // دوشنبه
      },
    },
    number: {
      fa: {
        numberingSystem: 'arab',
        currency: 'IRR',
        currencyDisplay: 'symbol',
      },
      en: {
        numberingSystem: 'latn',
        currency: 'USD',
        currencyDisplay: 'symbol',
      },
    },
  },
  
  // تنظیمات navigation (برای Next.js یا routing)
  navigation: {
    fa: {
      home: '/',
      about: '/درباره-ما',
      contact: '/تماس-با-ما',
    },
    en: {
      home: '/',
      about: '/about',
      contact: '/contact',
    },
  },
  
  // تنظیمات cookies و localStorage
  storage: {
    localeKey: 'preferred-language',
    directionKey: 'language-direction',
    themeKey: 'site-theme', // اگر theme دارید
  },
};

// توابع کمکی
export const getLanguageConfig = (locale) => {
  if (!locale) {
    return i18nConfig.languages[i18nConfig.defaultLocale];
  }
  
  const lang = i18nConfig.languages[locale];
  if (!lang) {
    console.warn(`Locale "${locale}" not found, falling back to default`);
    return i18nConfig.languages[i18nConfig.defaultLocale];
  }
  
  return lang;
};

export const isRTL = (locale) => {
  return getLanguageConfig(locale).dir === 'rtl';
};

export const getDirection = (locale) => {
  return getLanguageConfig(locale).dir;
};

export const getLocale = (locale) => {
  return getLanguageConfig(locale).locale;
};

export const getFontFamily = (locale) => {
  return getLanguageConfig(locale).fontFamily;
};

export const getSupportedLocales = () => {
  return i18nConfig.locales;
};

export const isValidLocale = (locale) => {
  return i18nConfig.locales.includes(locale);
};

export const getDefaultLocale = () => {
  return i18nConfig.defaultLocale;
};

export const getNavigation = (locale) => {
  const nav = i18nConfig.navigation?.[locale];
  if (!nav && locale !== i18nConfig.defaultLocale) {
    return i18nConfig.navigation?.[i18nConfig.defaultLocale] || {};
  }
  return nav || {};
};

export const getSeoConfig = (locale, overrides = {}) => {
  const langConfig = getLanguageConfig(locale);
  
  return {
    ...i18nConfig.seo,
    lang: locale,
    dir: langConfig.dir,
    locale: langConfig.locale,
    ...overrides,
  };
};

// تابع برای ساخت URL با locale
export const createLocalizedUrl = (path, locale, baseUrl = i18nConfig.seo.siteUrl) => {
  // اگر مسیر با اسلش شروع نشده، اضافه کن
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // اگر locale پیش‌فرض است، locale را به URL اضافه نکن (بستگی به استراتژی routing داره)
  const includeLocaleInPath = locale !== i18nConfig.defaultLocale;
  
  if (includeLocaleInPath) {
    return `${baseUrl}/${locale}${normalizedPath}`;
  }
  
  return `${baseUrl}${normalizedPath}`;
};

// تابع برای تغییر locale در URL (برای Next.js App Router)
export const changeLocaleInUrl = (url, newLocale) => {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // بررسی آیا locale در مسیر وجود دارد
  const currentLocale = i18nConfig.locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  let newPathname = pathname;
  
  if (currentLocale) {
    // جایگزینی locale فعلی
    newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
  } else if (newLocale !== i18nConfig.defaultLocale) {
    // اضافه کردن locale اگر پیش‌فرض نیست
    newPathname = `/${newLocale}${pathname}`;
  }
  // اگر newLocale پیش‌فرض است و locale در URL نیست، تغییری نده
  
  urlObj.pathname = newPathname;
  return urlObj.toString();
};