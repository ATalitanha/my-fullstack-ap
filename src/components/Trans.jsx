// components/Trans.js
'use client';

import { useTranslation } from '@/hooks/useLanguage';

export default function Trans({ 
  text, 
  namespace, 
  params, 
  children, 
  className,
  tag: Tag = 'span'
}) {
  const { t } = useTranslation(namespace);
  
  const translatedText = t(text, params);
  
  if (children) {
    return <Tag className={className}>{children(translatedText)}</Tag>;
  }
  
  return <Tag className={className}>{translatedText}</Tag>;
}