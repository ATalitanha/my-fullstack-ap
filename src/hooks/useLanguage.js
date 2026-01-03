// hooks/useLanguage.js
'use client';

import { useLanguage as useLanguageContext } from '@/constants/LanguageContext';

// هوک اصلی برای دسترسی به context
export const useLanguage = () => {
  return useLanguageContext();
};

// هوک برای ترجمه سریع
export const useTranslation = (namespace) => {
  const { t, language, changeLanguage, dictionary, isLoading } = useLanguageContext();
  
  const translate = (key, params) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey, params);
  };
  
  // برای دسترسی مستقیم به dictionary در namespace خاص
  const getNamespace = () => {
    if (!dictionary || !namespace) return {};
    
    const keys = namespace.split('.');
    let value = dictionary;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return {};
      }
    }
    
    return value || {};
  };
  
  return {
    t: translate,
    language,
    changeLanguage,
    dictionary: getNamespace(),
    isLoading,
    isRTL: language === 'fa',
  };
};

// هوک برای تشخیص RTL
export const useRTL = () => {
  const { dir } = useLanguageContext();
  return dir === 'rtl';
};

// هوک برای فرمت‌دهی اعداد
export const useNumberFormat = () => {
  const { formatNumber, language } = useLanguageContext();
  
  const format = (number, options) => {
    if (options && options.style === 'currency') {
      const currency = options.currency || (language === 'fa' ? 'IRR' : 'USD');
      const formatter = new Intl.NumberFormat(
        language === 'fa' ? 'fa-IR' : 'en-US',
        {
          style: 'currency',
          currency,
          minimumFractionDigits: options.minimumFractionDigits || 0,
          maximumFractionDigits: options.maximumFractionDigits || 2,
        }
      );
      return formatter.format(number);
    }
    
    return formatNumber(number);
  };
  
  return {
    format,
    language,
  };
};

// هوک برای فرمت‌دهی تاریخ
export const useDateFormat = () => {
  const { formatDate, language } = useLanguageContext();
  
  const format = (date, options) => {
    return formatDate(date, options);
  };
  
  // فرمت‌های از پیش تعریف شده
  const presets = {
    short: (date) => format(date, { year: 'numeric', month: 'short', day: 'numeric' }),
    long: (date) => format(date, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
    time: (date) => format(date, { hour: '2-digit', minute: '2-digit' }),
    datetime: (date) => format(date, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  };
  
  return {
    format,
    ...presets,
    language,
  };
};