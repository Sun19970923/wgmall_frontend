/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-15 20:21:20
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-19 20:49:32
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\components\NavBar.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NavBar, Space, Toast } from 'antd-mobile'
import { CloseOutline, MoreOutline, SearchOutline } from 'antd-mobile-icons'
import React from 'react'
import { useNavigate } from "react-router-dom";

const NavBarChunk = ({ title }) => {
  const navigate = useNavigate();

  const back = () => {
    navigate(-1)
  }

  return (
    <>
        <NavBar onBack={back} style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 1000 }}>{title}</NavBar>
    </>
  )
}

export default NavBarChunk;