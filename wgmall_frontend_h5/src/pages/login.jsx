/*
 * @Author: Evan 360313191@qq.com
 * @Date: 2025-07-09 12:55:39
 * @LastEditors: Evan 360313191@qq.com
 * @LastEditTime: 2025-07-09 14:23:33
 * @FilePath: \wgmall\wgmall_frontend_h5\src\pages\login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Checkbox, Input, Button, NavBar } from "antd-mobile";
import { useState } from "react";
import { getCaptcha, getCaptchaMock } from "@/api/user.js";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/css/login.less";
import logo from "../assets/logo.webp";


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
        <div className={}></div>
      </div>
    </>
  );
}
