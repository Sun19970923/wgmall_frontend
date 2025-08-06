import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhCN from './locales/zh-CN';  // 中文
import enUS from './locales/en-US';  // 英语
import esES from './locales/es-ES';  // 西班牙语
import trTR from './locales/tr-TR';  // 土耳其语
import ptPT from './locales/pt-PT';  // 葡萄牙语
import arAR from './locales/ar-AR';  // 阿拉伯语
import roRO from './locales/ro-RO';  // 罗马尼亚语
import ruRU from './locales/ru-RU';  // 俄语
import idID from './locales/id-ID';  // 印度尼西亚语
import thTH from './locales/th-TH';  // 泰语
import deDE from './locales/de-DE';  // 德语
import itIT from './locales/it-IT';  // 意大利语
import koKR from './locales/ko-KR';  // 韩语
import jaJP from './locales/ja-JP';  // 日语
import azAZ from './locales/az-AZ';  // 阿塞拜疆

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
  'es-ES': {
    translation: esES,
  },
  'tr-TR': {
    translation: trTR,
  },
  'pt-PT': {
    translation: ptPT,
  },
  'ar-AR': {
    translation: arAR,
  },
  'ro-RO': {
    translation: roRO,
  },
  'ru-RU': {
    translation: ruRU,
  },
  'id-ID': {
    translation: idID,
  },
  'th-TH': {
    translation: thTH,
  },
  'de-DE': {
    translation: deDE,
  },
  'it-IT': {
    translation: itIT,
  },
  'ko-KR': {
    translation: koKR,
  },
  'ja-JP': {
    translation: jaJP,
  },
  'az-AZ': {
    translation: azAZ,
  }
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
    
    // 设置右到左语言支持
    if (language === 'ar-AR') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.removeAttribute('dir');
    }

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
