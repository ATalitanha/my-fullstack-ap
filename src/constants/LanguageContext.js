// contexts/LanguageContext.js
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDictionary } from '@/lib/dictionaries';

// لیست زبان‌های پشتیبانی شده
export const SUPPORTED_LANGUAGES = [
  { code: 'fa', name: 'فارسی', dir: 'rtl', locale: 'fa-IR' },
  { code: 'en', name: 'English', dir: 'ltr', locale: 'en-US' },
];

const defaultLanguage = SUPPORTED_LANGUAGES[0];

// ایجاد Context
const LanguageContext = createContext({
  language: defaultLanguage.code,
  dir: defaultLanguage.dir,
  locale: defaultLanguage.locale,
  dictionary: null,
  isLoading: true,
  changeLanguage: () => {},
  t: (key) => key,
  formatNumber: (number) => number,
  formatDate: (date) => date,
  supportedLanguages: SUPPORTED_LANGUAGES,
});

// هوک برای استفاده آسان‌تر
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage باید داخل LanguageProvider استفاده شود');
  }
  return context;
};

// Provider اصلی
export function LanguageProvider({ children, initialLanguage = null }) {
  // State برای مدیریت زبان
  const [language, setLanguage] = useState(defaultLanguage.code);
  const [dir, setDir] = useState(defaultLanguage.dir);
  const [locale, setLocale] = useState(defaultLanguage.locale);
  const [dictionary, setDictionary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // تابع برای تغییر زبان
  const changeLanguage = useCallback(async (newLang) => { // اصلاح: de به newLang تغییر کرد
    try {
      setIsLoading(true);
      
      // پیدا کردن تنظیمات زبان جدید
      const langConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === newLang) || defaultLanguage;
      
      // بارگذاری دیکشنری جدید
      const newDictionary = await getDictionary(newLang);
      
      // آپدیت state
      setLanguage(langConfig.code);
      setDir(langConfig.dir);
      setLocale(langConfig.locale);
      setDictionary(newDictionary);
      
      // ذخیره در localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', newLang);
        localStorage.setItem('language-dir', langConfig.dir);
      }
      
      console.log(`Language changed to ${newLang}`);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تابع ترجمه (t)
  const t = useCallback((key, params = {}) => {
    if (!dictionary) return key;
    
    // تقسیم key به مسیر (مثال: 'common.welcome')
    const keys = key.split('.');
    let value = dictionary;
    
    // پیدا کردن مقدار در دیکشنری
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // اگر key پیدا نشد، خود key برگردانده شود
      }
    }
    
    // جایگزینی پارامترها (مثال: 'Hello {name}')
    if (typeof value === 'string' && params) {
      return Object.keys(params).reduce((str, paramKey) => {
        return str.replace(`{${paramKey}}`, params[paramKey]);
      }, value);
    }
    
    return value || key;
  }, [dictionary]);

  // فرمت‌دهی اعداد (متناسب با زبان)
  const formatNumber = useCallback((number) => {
    if (typeof number !== 'number' && typeof number !== 'string') {
      return number;
    }
    
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    if (isNaN(num)) {
      return number;
    }
    
    if (language === 'fa') {
      // تبدیل اعداد انگلیسی به فارسی
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return num.toString().replace(/\d/g, (digit) => persianNumbers[digit]);
    }
    
    return new Intl.NumberFormat(locale).format(num);
  }, [language, locale]);

  // فرمت‌دهی تاریخ (متناسب با زبان)
  const formatDate = useCallback((date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return date;
      }
      
      if (language === 'fa') {
        // استفاده از تاریخ شمسی
        // برای پیاده‌سازی کامل بهتر است از کتابخانه‌ای مثل jalaali-js استفاده کنید
        return dateObj.toLocaleDateString('fa-IR', mergedOptions);
      }
      
      return dateObj.toLocaleDateString(locale, mergedOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  }, [language, locale]);

  // به‌روزرسانی HTML attributes هنگام تغییر زبان
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
  }, [language, dir]);

  // ارسال event هنگام تغییر زبان
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    }
  }, [language]);

  // مقداردهی اولیه
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        let preferredLang = initialLanguage;
        
        // چک کردن localStorage برای زبان ذخیره شده
        if (typeof window !== 'undefined') {
          const savedLang = localStorage.getItem('preferred-language');
          const savedDir = localStorage.getItem('language-dir');
          
          if (savedLang) {
            preferredLang = savedLang;
            if (savedDir) {
              setDir(savedDir);
            }
          }
        }
        
        // پیدا کردن تنظیمات زبان
        const finalLang = preferredLang || defaultLanguage.code;
        const langConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === finalLang) || defaultLanguage;
        
        // بارگذاری دیکشنری
        const dict = await getDictionary(finalLang);
        
        // تنظیم state
        setLanguage(langConfig.code);
        setDir(langConfig.dir);
        setLocale(langConfig.locale);
        setDictionary(dict);
        
      } catch (error) {
        console.error('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [initialLanguage]);

  // مقدار Context
  const contextValue = {
    language,
    dir,
    locale,
    dictionary,
    isLoading,
    changeLanguage,
    t,
    formatNumber,
    formatDate,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Higher Order Component برای Server Components
export function withLanguage(Component) {
  return async function LanguageWrapper(props) {
    const { lang, ...restProps } = props;
    const dictionary = await getDictionary(lang || defaultLanguage.code);
    
    return <Component dictionary={dictionary} lang={lang} {...restProps} />;
  };
}