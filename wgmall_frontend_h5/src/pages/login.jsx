/*
 * @Author: Evan 360313191@qq.com
 * @Date: 2025-07-09 12:55:39
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-09 15:13:08
 * @FilePath: \wgmall\wgmall_frontend_h5\src\pages\login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Checkbox, Input, Button, NavBar } from "antd-mobile";
import { useState } from "react";
import { getCaptcha, getCaptchaMock } from "@/api/user.js";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/css/login.less";
import logo from "../assets/logo.webp";
import iogin1 from "../assets/login_1.webp";
import iogin2 from "../assets/login_2.webp";


export default function LoginPage() {
  const getCaptchaFunc = () => {
    getCaptcha();
    getCaptchaMock();
  };
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoChunk}>
          <img src={logo} alt="" />
          <span>CA</span>
        </div>
        <div className={styles.tips}>
            所有数据都将被加密
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.icons}>
          <div className={styles.icon_item}>
             <img src={iogin1} alt="" />
             <span>平台包邮</span>
             <span>专属优惠</span>
          </div>
          <div className={styles.icon_item}>
             <img src={iogin2} alt="" />
             <span>免费退货</span>
             <span>长达90天</span>
          </div>
        </div>
      </div>
    </>
  );
}
