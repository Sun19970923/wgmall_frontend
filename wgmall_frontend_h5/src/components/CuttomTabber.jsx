import { useLocation } from 'react-router-dom';
import { Grid } from 'antd-mobile';
import { AppstoreOutline, UnorderedListOutline, FingerdownOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { useTranslation } from 'react-i18next'; // Import useTranslation for i18n
import { history } from 'umi';
import classNames from 'classnames';
import styles from './index.module.less';

function CusttomTabBar() {
    const location = useLocation();
    const { pathname } = location;
    const { t } = useTranslation(); // Use the t function to access translations

    const tabs = [
        {
            key: '/order',
            title: t('cuttomtabber.home'), // Use t function for translation
            icon: <AppstoreOutline />,
        },
        {
            key: '/order/list',
            title: t('cuttomtabber.orders'), // Use t function for translation
            icon: <UnorderedListOutline />,
        },
        {
            key: '/order/matic',
            title: t('cuttomtabber.matic'), // Use t function for translation
            icon: <FingerdownOutline />,
        },
        {
            key: '/order/meeting',
            title: t('cuttomtabber.customerService'), // Use t function for translation
            icon: <MessageOutline />,
        },
        {
            key: '/order/user',
            title: t('cuttomtabber.myProfile'), // Use t function for translation
            icon: <UserOutline />,
        },
    ];

    return (
        <div className={styles.tabbar_cuttom}>
            <Grid columns={5} gap={8} style={{ width: '100%' }}>
                {tabs.map(item => (
                    <Grid.Item style={{ display: 'flex', justifyContent: 'center' }} key={item.key}>
                        {
                            item.key === '/order/matic' ?
                                <div className={classNames(styles['grid-demo-item-block'], styles.matic)} onClick={() => history.push(item.key)}>
                                    {item.icon}
                                    <p>{item.title}</p>
                                </div>
                                :
                                <div className={classNames(styles['grid-demo-item-block'], pathname === item.key ? styles['active'] : '')} onClick={() => history.push(item.key)}>
                                    {item.icon}
                                    <p>{item.title}</p>
                                </div>
                        }
                    </Grid.Item>
                ))}
            </Grid>
        </div>
    );
}

export default CusttomTabBar;
