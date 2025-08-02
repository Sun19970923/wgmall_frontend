/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-30 00:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 23:20:44
 * @FilePath: \新建文件夹\新建文件夹\src\i18n.js
 * @Description: UmiJS 4.0.25 手动国际化配置
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
};

const getDefaultLanguage = () => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage && resources[savedLanguage]) {
    return savedLanguage;
  }
  
  localStorage.setItem('selectedLanguage', 'en-US');
  return 'en-US';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = (language) => {
  if (resources[language]) {
    i18n.changeLanguage(language);
    localStorage.setItem('umi_locale', language);
    return true;
  }
  return false;
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getSupportedLanguages = () => {
  return Object.keys(resources);
};

export default i18n; 