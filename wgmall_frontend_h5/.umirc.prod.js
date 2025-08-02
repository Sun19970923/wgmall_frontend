/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-31 01:26:39
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\.umirc.prod.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "umi";

export default defineConfig({
  define: {
    baseApi: "https://api.xxzh.cc",
    "process.env": {
      NODE_ENV: "uat",
      UMI_ENV: "uat",
    },
  },
});
