/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-15 16:42:34
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Swiper, Toast, Card, Space, TabBar, Badge, Divider, Grid } from "antd-mobile";
import styles from "./index.module.less";
import { formatAmount } from '@/utils/utils'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
  AppstoreOutline,
  BillOutline,
  FingerdownOutline
} from 'antd-mobile-icons'
import {
    useLocation,
    MemoryRouter as Router,
} from 'react-router-dom'
import classNames from 'classnames';
import { history } from 'umi';

function CusttomTabBar () {
    const location = useLocation()
    const { pathname } = location
    console.log(pathname, '/active');
    

    const tabs = [
        {
            key: '/order',
            title: '首页',
            icon: <AppstoreOutline />,
        },
        {
            key: '/order/list',
            title: '订单',
            icon: <UnorderedListOutline />,
        },
        {
            key: '/order/matic',
            title: 'Matic',
            icon: <FingerdownOutline />,
        },
        {
            key: '/order/meeting',
            title: '客服',
            icon: <MessageOutline />,
        },
        {
            key: '/order/user',
            title: '我的',
            icon: <UserOutline />,
        },
    ]

    return (
        <div className={styles.tabbar_cuttom}>
            <Grid columns={5} gap={8} style={{ width: '100%' }}>
            {tabs.map(item => (
                <Grid.Item style={{ display: 'flex', justifyContent: 'center' }} key={item.key}>
                    {
                        item.key === '/order/matic' ?
                        <div className={classNames(styles['grid-demo-item-block'], styles.matic)}  onClick={() => history.push(item.key)}>
                            { item.icon }
                            <p>{ item.title }</p>
                        </div>
                        :
                        <div className={classNames(styles['grid-demo-item-block'], pathname === item.key ? styles['active'] : '')} onClick={() => history.push(item.key)}>
                            { item.icon }
                            <p>{ item.title }</p>
                        </div>
                    }
                </Grid.Item>
            ))}
            </Grid>
        
        </div>
    )
}

export default CusttomTabBar;
