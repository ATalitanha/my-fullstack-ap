// lib/withLanguageServer.js
import { getDictionary } from './dictionaries';

export async function withLanguageServer(Component, ) {
  return async function ServerComponentWithLanguage(props) {
    const { lang = 'fa', ...restProps } = props;
    const dictionary = await getDictionary(lang);
    
    // استخراج ترجمه‌های مورد نیاز از namespace خاص
    const translations =   dictionary;
    
    return <Component {...restProps} dictionary={translations} lang={lang} />;
  };
}