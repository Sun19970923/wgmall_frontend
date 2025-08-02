/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-15 16:36:59
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-15 16:37:27
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\utils\loadMeiqia.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/utils/loadMeiqia.ts

let isLoaded = false;

export const loadMeiqia = (entId) => {
  if (isLoaded) return;

  (function(m, ei, q, i, a, j, s) {
    m[a] = m[a] || function() {
      (m[a].a = m[a].a || []).push(arguments);
    };
    j = ei.createElement(q);
    s = ei.getElementsByTagName(q)[0];
    j.async = true;
    j.charset = 'UTF-8';
    j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
    s.parentNode.insertBefore(j, s);
  })(window, document, 'script', '_MEIQIA');

  window._MEIQIA = window._MEIQIA || function() {
    (window._MEIQIA.a = window._MEIQIA.a || []).push(arguments);
  };

  window._MEIQIA('entId', entId);

  isLoaded = true;
};
