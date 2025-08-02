/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 23:31:15
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\.umirc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "umi";
const pxtorem = require("postcss-pxtorem");

export default defineConfig({
  npmClient: "npm",
  extraPostCSSPlugins: [
    pxtorem({
      rootValue: 75, //这里根据设计稿大小配置,一般是375
      propList: ["*"],
    }),
  ],
  proxy: {
    '/api': {
      'target': 'https://api.xxzh.cc', // 后端服务实际地址
      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
    },
  },
  define: {
    baseApi: "https://api.xxzh.cc",
    "process.env": {
      NODE_ENV: "dev",
      UMI_ENV: "dev",
    },
  },
  plugins: [
    "@umijs/plugins/dist/dva",
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/request',
  ],
  dva: {},
  scripts: [
    // 在 <body> 末尾添加的脚本代码片段
    `
      (function(m, ei, q, i, a, j, s) {
          m[i] = m[i] || function() {
              (m[i].a = m[i].a || []).push(arguments)
          };
          j = ei.createElement(q),
              s = ei.getElementsByTagName(q)[0];
          j.async = true;
          j.charset = 'UTF-8';
          j.src = 'https://static.meiqia.com/dist/meiqia.js';
          s.parentNode.insertBefore(j, s);
      })(window, document, 'script', '_MEIQIA');
      _MEIQIA('entId', 'a791972c4d1a455e870b2a2c28a5d86a');
      // 在这里开启手动模式（必须紧跟美洽的嵌入代码）
      _MEIQIA('withoutBtn');
    `
  ],
});
