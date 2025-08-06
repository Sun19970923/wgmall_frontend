import { Toast, NoticeBar, Tabs, Empty, Ellipsis } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from '@/assets/css/pay.less';
import { formatAmount } from '@/utils/utils';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline, AppstoreOutline, BillOutline, FingerdownOutline } from 'antd-mobile-icons';
import Swiper from '../components/Swiper';
import { info, getAddress } from '@/api/user';
import { buy } from '@/api/product';
import { useEffect, useState } from 'react';
import { wishlistAdd } from '@/api/product';
import Countdown from '../components/Countdown';
import ShopCar from '../components/ShopCar';
import NavBar from "../components/NavBar";
import { useTranslation } from 'react-i18next';  // 引入 useTranslation

const Pay = () => {
  const { t } = useTranslation(); // 获取 t 函数
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [data, setData] = useState({}); // data
  const [address, setAddress] = useState(false); // data

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    let item = JSON.parse(localStorage.getItem('item'));

    const res = await getAddress({ userId: userinfo.id });

    setUser(userinfo);
    setData(item);

    if(res.code == 200){
        setAddress(res.data.address);
    }
  };

  //付款
  const buyItem = async () => {
    if(!address) {
        return Toast.show({
            icon: 'fail',
            content: t('pay.addAddress'),  // 使用翻译
        });
    }
    let item = JSON.parse(localStorage.getItem('item'));

    let res = await buy({
        "userId": user.id,
        "productId": item.id,
        "quantity": item.count,
        "totalAmount": Number(item.count * item.price),
        "sellerName": item.uploader
    });

    if(res.code == 200){
        Toast.show({
            icon: 'success',
            content: res.message,
        });

        setTimeout(() => {
            navigate('/home');
        }, 1000);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.indexContainer}>
      <NavBar title={t('pay.checkout')} />  {/* 使用翻译 */}

      <NoticeBar
        color='success'
        shape='rounded'
        bordered={false}
        speed="100"
        content={t('pay.notice')}  
      />

      <div className={styles.indexBody}>
        {
            address ? 
            <div className={styles.address}>
                <div className={styles.addressTitle}>   
                    <img src={require('@/assets/icon/black_zuobiao.png')} alt="" />
                    <p>{address.country + " " + address.province + " " + address.city + " " + address.district + " " + address.street}</p>
                </div>

                <div className={styles.addressTitle}>   
                    <img src={require('@/assets/icon/user.png')} alt="" />
                    <p>{address.receiverName + " " + address.receiverPhone + " " + address.detail }</p>
                </div>
            </div>
            :
            <div className={styles.notDat} onClick={() => navigate('/user/address')}>
                <div className={styles.button}>{t('pay.addAddressButton')}</div> {/* 使用翻译 */}
            </div>
        }

        <div className={styles.line}>
            <img src={require('@/assets/liune.png')} alt="" />
        </div>
      </div>

      <PayItem data={data} />

      <ViewItem />
      <ViewItem2 />
      <ViewItem3 />
      <ViewItem4 />
      
      <Express />

      {
        data.id &&
        <ShopCar type={1} item={data} onBuy={() => buyItem()} />
      }
    </div>
  );
};

function PayItem ({ data }) {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.PayItem}>
            <img src={baseApi + data.imagePath} alt="" />
            <h3>{data.name}</h3>
            <p>{t('pay.price')}: $ {data.price}  &nbsp; &nbsp;&nbsp;  {t('pay.type')}: {data.type}  &nbsp; &nbsp;&nbsp; {t('pay.uploader')}: {data.uploader}</p> {/* 使用翻译 */}
            <div>
                {t('pay.fastShipping')}: {t('pay.free')}，{t('pay.deliveryTime')}: 4-12 {t('pay.businessDays')} {t('pay.fastestDelivery')}
            </div>
        </div>
    );
}

function ViewItem () {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}>{t('pay.temuDonation')}</div>  {/* 使用翻译 */}
            <div className={styles.content}>
                {t('pay.temuDonationDescription')}
            </div>
        </div>
    );
}

function ViewItem2 () {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}><img src={require('@/assets/icon/dunpai.png')} alt="" /> {t('pay.donateWithTemu')}</div>  {/* 使用翻译 */}
            <div className={styles.content}>
                {t('pay.donateMessage')}
            </div>
        </div>
    );
}

function ViewItem3 () {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}><img src={require('@/assets/icon/car.png')} alt="" /> {t('pay.shippingAssurance')}</div>  {/* 使用翻译 */}
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.deliveryCompensation')}
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.productReturnable')}
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.trackingRefund')}
            </div>
        </div>
    );
}

function ViewItem4 () {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}><img src={require('@/assets/icon/dunpai.png')} alt="" /> {t('pay.temuProtectsCardInfo')}</div>  {/* 使用翻译 */}
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.pciDss')}
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.cardInfoSecure')}
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.dataEncrypted')}
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  {t('pay.temuWillNotSell')}
            </div>
        </div>
    );
}

function Express () {
    const { t } = useTranslation(); // 获取 t 函数
    return (
        <div className={styles.Express}>
            <div className={styles.title}>
                <div>
                    <img src={require('@/assets/icon/car.png')} alt="" />
                    <span>{t('pay.freeShipping')}</span>  {/* 使用翻译 */}
                </div>
                
                <div>
                    {t('pay.expressFree')}: {t('pay.free')}
                    <span>{t('pay.fastestDelivery')}</span>
                </div>
            </div>

            <div className={styles.title}>
                <div>
                    <img src={require('@/assets/icon/dunpai.png')} alt="" />
                    <span>{t('pay.paymentSecurity')}</span>  {/* 使用翻译 */}
                </div>
                
            </div>

        </div>
    );
}

export default Pay;
