import React, { useState, useEffect } from 'react';
import { List, Badge, InfiniteScroll, Empty, SearchBar } from 'antd-mobile';
import { MessageOutline, FileOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import NavBar from '../components/NavBar';
import { search } from '@/api/product';
import styles from '@/assets/css/searchPage.less';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 引入 i18n 的 hook

export default function SearchPage() {
  const { t } = useTranslation(); // 使用 t 方法获取翻译
  const [msgList, setMsgList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [val, setVal] = useState('');
  const [current, setCurrent] = useState({ page: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (val !== '') {
      loadMore();
    }
  }, [val]);

  const loadMore = async () => {
    if (!val) {
      setHasMore(false);
      return;
    }

    try {
      let res = await search({ keyword: val, page: current.page, size: 10 });
      setCurrent((prev) => ({ page: prev.page + 1 }));

      if (res.data.length === 0) {
        setHasMore(false);
      }

      setMsgList((prev) => {
        if ([...prev, ...res.data].length >= res.data.total) {
          setHasMore(false);
        }
        return [...prev, ...res.data];
      });
    } catch (error) {
      console.error(t('searchpage.searchRequestFailed'), error);
    }
  };

  const getData = (aaa) => {
    setVal(aaa);
    setHasMore(true);
    setMsgList([]);
    setCurrent({ page: 0 });
  };

  const handleRead = (id) => {
    setMsgList((list) =>
      list.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
    );
  };

  return (
    <div className={styles.content} style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
      <NavBar
        title={t('searchpage.search')}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          height: '100px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      />
      <SearchBar
        onSearch={(val) => {
          getData(val);
        }}
        style={{
          '--height': '50px',
          fontSize: '16px',
          borderRadius: '25px',
          backgroundColor: '#f8f9fa',
          padding: '0 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          color: '#333',
          outline: 'none',
          border: 'none',
        }}
        placeholder={t('searchpage.enterContent')}
        clearable
        showClearButton
        onFocus={() => {
          document.activeElement.style.outline = 'none';
          document.activeElement.style.boxShadow = 'none';
        }}
        onBlur={() => {
          document.activeElement.style.outline = 'none';
          document.activeElement.style.boxShadow = 'none';
        }}
      />

      {msgList.length > 0 ? (
        <div className={styles.goodsGrid}>
          {msgList.map((msg, i) => (
            <div
              key={i}
              className={styles.goodsItem}
              onClick={() => {
                localStorage.setItem('item', JSON.stringify(msg));
                navigate('/details');
              }}
            >
              <img className={styles.goodsImg} src={baseApi + msg.imagePath} alt={msg.name} />
              <div className={styles.goodsInfo}>
                <span className={styles.goodsName}>{msg.name}</span>
                <div className={styles.goodsPrice}>
                  <span className={styles.price}>${msg.price}</span>
                  <span className={styles.sales}>{t('home.goods.sales')}：{msg.sales || 0}</span>
                  <div className={styles.goodsSeller}>
                    {t('details.seller')}: {msg.uploader || '-'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty style={{ padding: '64px 0' }} imageStyle={{ width: 128 }} description={t('searchpage.noData')} />
      )}

      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}
