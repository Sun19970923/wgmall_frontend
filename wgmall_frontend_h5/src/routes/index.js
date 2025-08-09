import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";

/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-10 03:03:18
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\routes\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
    routes: [
        {path: '/login', component: 'login'},
        {path: '/orderlogin', component: 'orderLogin'},


        {
            path: '/',
            component: '@/layouts/index',
            routes: [
                {path: '/home', component: 'home'},
                {path: '/details', component: 'details'},
                {path: '/pay', component: 'pay'},
                {path: '/integral', component: 'integral'},
                {path: '/my', component: 'my'},
                {
                    path: '/user',
                    component: '/user/index',
                    routes: [
                        {
                            path: '/user/message',
                            component: './user/message',
                        },
                        {
                            path: '/user/address',
                            component: './user/address',
                        },
                        {
                            path: '/user/apply',
                            component: './user/apply',
                        },
                        {
                            path: '/user/wishlistList',
                            component: './user/wishlistList',
                        },
                        {
                            path: '/user/order',
                            component: './user/order',
                        },
                        {
                            path: '/user/approve',
                            component: './user/approve',
                        },
                        {
                            path: '/user/wallect',
                            component: './user/wallect',
                        },
                        {
                            path: '/user/finance',
                            component: './user/finance',
                        },
                        {
                            path: '/user/dialogue',
                            component: './user/dialogue',
                        },
                        {
                            path: '/user/shopHome',
                            component: './user/shopHome',
                        },
                        {
                            path: '/user/product',
                            component: './user/product',
                        },
                        {
                            path: '/user/myShop',
                            component: './user/myShop',
                        },
                        {
                            path: '/user/shopOrder',
                            component: './user/shopOrder',
                        },
                        {
                            path: '/user/shopMeeting',
                            component: './user/shopMeeting',
                        },
                        {
                            path: '/user/userMeeting',
                            component: './user/userMeeting',
                        },
                    ],
                },
                {path: '/about', component: 'about'},
                {path: '/netWork404', component: 'netWork404'},
                {path: '/searchPage', component: 'searchPage'},
                {path: '/LanguageSwitchPage', component: 'LanguageSwitchPage'},
                {path: '/shopPage', component: 'shopPage'},
                {
                    path: '/order',
                    component: '/order/index',
                    routes: [
                        {
                            path: '/order/home',
                            component: './order/home',
                        },
                        {
                            path: '/order/matic',
                            component: './order/matic',
                        },
                        {
                            path: '/order/meeting',
                            component: './order/meeting',
                        },
                        {
                            path: '/order/user',
                            component: './order/user',
                        },
                        {
                            path: '/order/recharge',
                            component: './order/recharge',
                        },
                        {
                            path: '/order/rechargeP2P',
                            component: './order/rechargeP2P',
                        },
                        {
                            path: '/order/withdraw',
                            component: './order/withdraw',
                        },
                        {
                            path: '/order/withdrawP2P',
                            component: './order/withdrawP2P',
                        },
                        {
                            path: 'order/withdrawWalletSet',
                            component: './order/withdrawWalletSet',
                        }
                    ],
                },
            ],
        },
    ],
}
