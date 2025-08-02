/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-29 01:07:13
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from "react";
import yayJpg from "../assets/yay.jpg";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const navigate = useNavigate();


  useEffect(() => {
    navigate('/home')
  }, [])

  return (
    <div>
      <h2>Yay! Welcome to umi!</h2>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
      <p>去首页看看。</p>
    </div>
  );
}
