import React, { useState, useEffect, useMemo } from 'react';
import {
  List,
  Badge,
  InfiniteScroll,
  Empty,
  SearchBar,
  Segmented,
  ActionSheet,
  Card,
} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import NavBar from '../components/NavBar';
import { search } from '@/api/product';
import styles from '@/assets/css/searchPage.less';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchShopsByNameWithProducts } from '../api/ash';
import heart from '@/assets/level15.png';
import diamond from '@/assets/level610.png';
import oldcrown from '@/assets/level1115.png';
import newcrown from '@/assets/level1620.png';

export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [msgList, setMsgList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [val, setVal] = useState('');
  const [current, setCurrent] = useState({ page: 0 });
  const [searchType, setSearchType] = useState('product'); // 'product' | 'shop'

  //  店铺模式用的状态
  const [shopHeader, setShopHeader] = useState(null); // { name, avatarUrl, description, ... }
  const [shopProducts, setShopProducts] = useState([]); // 店铺的商品
  const [shopSearched, setShopSearched] = useState(false); // 是否已经尝试过按店铺查过一次
  const isShopMode = searchType === 'shop';

  // 渲染等级图标
  const renderLevelIcons = (level) => {
    if (!level || level < 1) return null;

    let iconSrc;
    let count;

    if (level >= 1 && level <= 5) { // 爱心
      iconSrc = heart;
      count = level;
    } else if (level >= 6 && level <= 10) { // 淘宝的钻石
      iconSrc = diamond;
      count = level - 5;
    } else if (level >= 11 && level <= 15) { // 老皇宫
      iconSrc = oldcrown;
      count = level - 10;
    } else if (level >= 16 && level <= 20) { // 新皇宫
      iconSrc = newcrown;
      count = level - 15;
    }

    return (
      <span style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
        {Array.from({ length: count }, (_, i) => (
          <img
            key={i}
            src={iconSrc}
            alt="level icon"
            style={{ width: 14, height: 14 }}
          />
        ))}
      </span>
    );
  };


  useEffect(() => {
    if (val !== '') {
      // 每次关键字或模式切换时，重置状态 + 触发加载
      resetAndLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val, searchType]);

  // 初始化时恢复
  useEffect(() => {
    const saved = localStorage.getItem('searchPageState');
    if (saved) {
      const parsed = JSON.parse(saved);
      setVal(parsed.val || '');
      setSearchType(parsed.searchType || 'product');
      setShopHeader(parsed.shopHeader || null);
      setShopProducts(parsed.shopProducts || []);
      setMsgList(parsed.msgList || []);
      setHasMore(parsed.hasMore ?? true);
      setShopSearched(parsed.shopSearched || false);
      setCurrent(parsed.current || { page: 0 });
    }
  }, []);

  // 每次数据变化时保存
  useEffect(() => {
    localStorage.setItem(
      'searchPageState',
      JSON.stringify({
        val,
        searchType,
        shopHeader,
        shopProducts,
        msgList,
        hasMore,
        shopSearched,
        current,
      })
    );
  }, [val, searchType, shopHeader, shopProducts, msgList, hasMore, shopSearched, current]);


  const resetAndLoad = async () => {
    setHasMore(true);
    setMsgList([]);
    setCurrent({ page: 0 });
    setShopHeader(null);
    setShopProducts([]);
    setShopSearched(false);
    if (isShopMode) {
      await loadShopFirstThenFallback();
    } else {
      await loadMore(); // 商品模式直接走无限加载
    }
  };

  //  店铺优先：如果没有店铺，展示 Empty + 商品搜索结果
  const loadShopFirstThenFallback = async () => {
    if (!val) {
      setHasMore(false);
      setShopSearched(true);
      return;
    }
    try {
      const res = await searchShopsByNameWithProducts(val, 0, 1); 
      setShopSearched(true);

      const first = res?.data?.[0]; // ✅按真实格式取第一家店
      if (first) {
        setShopHeader(first);
        setShopProducts(first.products || []);
        setHasMore(false);
      } else {
        await loadMore();
      }
    } catch (e) {
      console.error('shop search failed', e);
      setShopSearched(true);
      await loadMore();
    }
  };


  // 原有“按商品名”搜索 + 无限滚动
  const loadMore = async () => {
    if (!val) {
      setHasMore(false);
      return;
    }
    try {
      const res = await search({
        keyword: val,
        page: current.page,
        size: 10,
        type: 'product', //  强制按商品搜（不受 searchType 影响，用作店铺查不到时的回落）
      });

      setCurrent((prev) => ({ page: prev.page + 1 }));

      if (Array.isArray(res.data)) {
        // 兼容后端 data 为数组的情况
        if (res.data.length === 0) setHasMore(false);
        setMsgList((prev) => [...prev, ...res.data]);
      } else {
        // 如果后端是 Page 结构 { content, total, ... }
        const { content = [], total = 0 } = res.data || {};
        if (content.length === 0) setHasMore(false);
        setMsgList((prev) => {
          const merged = [...prev, ...content];
          if (merged.length >= total) setHasMore(false);
          return merged;
        });
      }
    } catch (error) {
      console.error(t('searchpage.searchRequestFailed'), error);
      setHasMore(false);
    }
  };

  const getData = (keyword) => {
    setVal(keyword?.trim() || '');
  };

  const openTypeSheet = () => {
    const actions = [
      {
        text: t('searchpage.byProduct') || '按商品',
        key: 'product',
        description: searchType === 'product' ? (t('common.current') || '当前') : undefined,
      },
      {
        text: t('searchpage.byShop') || '按店铺',
        key: 'shop',
        description: searchType === 'shop' ? (t('common.current') || '当前') : undefined,
      },
    ];

    ActionSheet.show({
      extra:
        (t('searchpage.searchType') || '搜索类型') +
        '：' +
        (searchType === 'shop' ? t('searchpage.byShop') || '按店铺' : t('searchpage.byProduct') || '按商品'),
      actions,
      cancelText: t('common.cancel') || '取消',
      closeOnAction: true,
      onAction: (action) => {
        if (action.key !== searchType) {
          setSearchType(action.key);
          // 重置会由 useEffect 调用 resetAndLoad
        }
      },
    });
  };

  //  店铺头部卡片
const ShopHeader = useMemo(() => {
  if (!shopHeader) return null;
  return (
    <div
      style={{ padding: '8px 12px 0', cursor: 'pointer' }}
      onClick={() => navigate(`/shopPage`)} // 跳转到店铺详情页
    >
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img
            src={shopHeader.avatarUrl ? baseApi + shopHeader.avatarUrl : ''}
            alt={shopHeader.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              objectFit: 'cover',
              background: '#f2f3f5',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                lineHeight: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {shopHeader.name}
              {renderLevelIcons(shopHeader.level)}
            </div>
            <div
              style={{
                color: '#999',
                marginTop: 2,
                fontSize: 12,
                lineHeight: '18px',
              }}
            >
              {shopHeader.description || '-'}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                marginTop: 8,
                flexWrap: 'wrap',
              }}
            >
              {[shopHeader.tag1, shopHeader.tag2, shopHeader.tag3]
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: '3px 6px',
                      borderRadius: 999,
                      background: '#f5f5f5',
                      color: '#666',
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}, [shopHeader, navigate]);



  const showEmptyForShop = isShopMode && shopSearched && !shopHeader;

  return (
    <div
      className={styles.content}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)',
        padding: '0 0 32px 0',
      }}
    >
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

      {/* 顶部：左下三角 + 右搜索框 */}
      <div
        style={{
          position: 'sticky',
          top: 10,
          zIndex: 999,
          background: 'transparent',
          padding: '12px 12px 8px',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={openTypeSheet}
            aria-label="选择搜索类型"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 22,
              border: '1px solid #eee',
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            <DownOutline />
          </button>

          <div style={{ flex: 1 }}>
            <SearchBar
              onSearch={getData}
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
              placeholder={isShopMode ? t('searchpage.enterShop') || '输入店铺名' : t('searchpage.enterProduct') || '输入商品名'}
              clearable
              showClearButton
            />
          </div>
        </div>
      </div>

      {/*  店铺头部（仅店铺查询命中时显示） */}
      {ShopHeader}

      {/*  如果是店铺模式但没有命中店铺，显示一个“NothingHere” */}
      {showEmptyForShop && (
        <Empty
          style={{ padding: '24px 0 0' }}
          imageStyle={{ width: 128 }}
          description={t('searchpage.nothingHere') || 'Nothing Here'}
        />
      )}

      {/* 列表区域：
          - 店铺命中：展示该店铺的 products
          - 店铺未命中：展示“按商品名”的结果（msgList）
          - 商品模式：展示 msgList
      */}
      {((isShopMode && shopHeader && shopProducts.length > 0) || (!isShopMode && msgList.length > 0) || (showEmptyForShop && msgList.length > 0)) ? (
        <div className={styles.goodsGrid} style={{ paddingTop: 8 }}>
          {(isShopMode && shopHeader ? shopProducts : msgList).map((msg, i) => (
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
                  <span className={styles.sales}>
                    {t('home.goods.sales')}：{msg.sales || 0}
                  </span>
                  <div className={styles.goodsSeller}>
                    {t('details.seller')}: {msg.seller || '-'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 商品模式 or 店铺未命中且也没有商品结果时
        !isShopMode && (
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description={t('searchpage.noData')}
          />
        )
      )}

      {/* 无限滚动：
          - 店铺命中：不需要无限滚动（一次性展示店铺全部商品）
          - 其余情况（商品模式；或店铺未命中时的回落商品列表）：开启无限滚动
      */}
      {(!isShopMode || (isShopMode && !shopHeader)) && (
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      )}
    </div>
  );
}
