/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-30 00:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 23:27:25
 * @FilePath: \新建文件夹\新建文件夹\LanguageSwitchPage.jsx
 * @Description: 多语言切换页面组件
 */
import React, { useState, useEffect } from 'react';
import {
  NavBar,
  List,
  Radio,
  Toast,
  Button
} from 'antd-mobile';
import {
  CheckOutline,
  GlobalOutline
} from 'antd-mobile-icons';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// 语言配置
const languages = [
  {
    code: 'zh-CN',
    name: '简体中文',
    nativeName: '简体中文',
    flag: 'zh'
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'es-ES',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'tr-TR',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷'
  },
  {
    code: 'pt-PT',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇵🇹'
  },
  {
    code: 'ar-AR',
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦'
  },
  {
    code: 'ro-RO',
    name: 'Română',
    nativeName: 'Română',
    flag: '🇷🇴'
  },
  {
    code: 'ru-RU',
    name: 'Русский',
    nativeName: 'Русский',
    flag: '🇷🇺'
  },
  {
    code: 'id-ID',
    name: 'Bahasa Indonesia',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩'
  },
  {
    code: 'th-TH',
    name: 'ไทย',
    nativeName: 'ไทย',
    flag: '🇹🇭'
  },
  {
    code: 'de-DE',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'it-IT',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹'
  },
  {
    code: 'ko-KR',
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷'
  },
  {
    code: 'ja-JP',
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵'
  },
  {
    code: 'az-AZ',
    name: 'Azərbaycan',
    nativeName: 'Azərbaycan',
    flag: '🇦🇿'
  }
];

export default function LanguageSwitchPage() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN'); // 默认简体中文
  const [isLoading, setIsLoading] = useState(false);

  // 初始化时从 localStorage 获取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  // 处理语言切换
  const handleLanguageChange = async (languageCode) => {
    setIsLoading(true);
    try {
      // 这里可以调用API切换语言
      // await fetch('/api/change-language', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ language: languageCode })
      // });

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      setSelectedLanguage(languageCode);

      // 切换 i18n 语言
      await i18n.changeLanguage(languageCode);

      // 保存到本地存储
      localStorage.setItem('selectedLanguage', languageCode);

      Toast.show({
        content: 'success',
        position: 'center',
      });

      // 这里可以触发语言切换的回调
      // onLanguageChange?.(languageCode);

    } catch (error) {
      Toast.show({
        content: 'failed',
        position: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取当前语言信息
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      <NavBar
        backArrow={true}
        onBack={() => window.history.back()}
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        Language
      </NavBar>

      {/* 当前语言显示 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GlobalOutline style={{ fontSize: '20px', marginRight: '8px', color: '#666' }} />
            <span style={{ fontSize: '14px', color: '#666' }}>Current</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>
              {getCurrentLanguage().flag}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>
              {getCurrentLanguage().nativeName}
            </span>
          </div>
        </div>
      </div>

      {/* 语言列表 */}
      <div style={{ backgroundColor: '#fff' }}>
        <List header={t('language.select')}>
          {languages.map((language) => (
            <List.Item
              key={language.code}
              prefix={
                <span style={{ fontSize: '24px', marginRight: '12px' }}>
                  {language.flag}
                </span>
              }
              extra={
                <Radio
                  checked={selectedLanguage === language.code}
                  onChange={() => handleLanguageChange(language.code)}
                  disabled={isLoading}
                />
              }
              onClick={() => handleLanguageChange(language.code)}
              style={{
                cursor: 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                  {language.nativeName}
                </span>
                <span style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                  {language.name}
                </span>
              </div>
            </List.Item>
          ))}
        </List>
      </div>

      {/* 底部说明 */}
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#999',
        fontSize: '12px',
        lineHeight: '1.5'
      }}>
        {/* <p>{t('language.switchTip1')}</p>
        <p>{t('language.switchTip2')}</p> */}
      </div>


    </div>
  );
} 