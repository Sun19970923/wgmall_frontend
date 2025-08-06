import { PullToRefresh, Button, Toast, Card, Space, TabBar, Badge, Divider, Grid, SearchBar, Avatar, Tabs, Empty, Ellipsis } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from '@/assets/css/details.less';
import { formatAmount } from '@/utils/utils';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline, AppstoreOutline, BillOutline, FingerdownOutline } from 'antd-mobile-icons';
import Swiper from '../components/Swiper';
import { info } from '@/api/user';
import { useEffect, useState } from 'react';
import { wishlistAdd } from '@/api/product';
import Countdown from '../components/Countdown';
import ShopCar from '../components/ShopCar';
import { useTranslation } from 'react-i18next'; // 引入 useTranslation

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 获取 t 函数
  const [user, setUser] = useState({}); // data

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('item'));
    console.log(userinfo, '111');
    setUser(userinfo);
  };

  const addCar = async (user) => {
    let avat = JSON.parse(localStorage.getItem('userInfo'));

    let res = await wishlistAdd({ userId: avat.id, productId: user.id });

    console.log(res, 'resres');
    if (res.code == 200) {
      Toast.show({
        content: t('details.addToWishlistSuccess'), // 使用翻译
        icon: 'success'
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.indexContainer}>
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: '1em' }}>
          <img src={require('@/assets/logo.webp')} onClick={() => navigate('/home')} alt="" />
          <div>
            <SearchBar
              placeholder={t('details.searchPlaceholder')} // 使用翻译
              onFocus={() => {
                navigate('/searchPage');
                setFouce(true);
              }}
            />
          </div>
        </div>
        <div onClick={() => navigate('/my')}>
          <Avatar src="" style={{ '--size': '38px', '--border-radius': '50%' }} />
        </div>
      </div>

      <div className={styles.indexBody}>
        <img className={styles.banner} src={baseApi + user.imagePath} alt="" />

        <div className={styles.product_info}>
          <h2>{user.name}</h2>
          <div className={styles.sales}>
            <span>{t('details.sold')}: {user.sales || 0}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{t('details.category')}: {user.type}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{t('details.seller')}: {user.uploader}</span>
          </div>
          <div className={styles.price}>
            $ {formatAmount(user.price || 0)}
            <div onClick={() => addCar(user)}>
              <img src={require('@/assets/icon/xinyuan.png')} alt="" />
              {t('details.addToWishlist')}
            </div>
          </div>

          <div className={styles.huodong}>
            <div className={styles.huodong_title}>
              <span style={{ marginRight: '20px' }}>{t('details.promotion')}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {t('details.countdown')}: <Countdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Express />

      <ShopCar item={user} />
    </div>
  );
};

function Express() {
  const { t } = useTranslation(); // 使用 t 函数获取翻译
  return (
    <div className={styles.Express}>
      <div className={styles.title}>
        <div>
          <img src={require('@/assets/icon/car.png')} alt="" />
          <span>{t('details.freeShipping')}</span>
        </div>
        <div>
          {t('details.fastShipping')}: {t('details.free')}
          <span>{t('details.fastestDelivery')}</span>
        </div>
      </div>

      <div className={styles.title}>
        <div>
          <img src={require('@/assets/icon/dunpai.png')} alt="" />
          <span>{t('details.paymentSecurity')}</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
