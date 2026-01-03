// lib/dictionaries.js


const dictionaries = {
  fa: () => import('@/dictionaries/fa.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  const normalizedLocale = locale || 'fa';
  return dictionaries[normalizedLocale]?.() || dictionaries.fa();
};

// برای استفاده در Server Components
export const getServerDictionary = async (locale) => {
  return await getDictionary(locale);
};