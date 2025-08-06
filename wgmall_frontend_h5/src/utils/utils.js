/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 23:34:42
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-30 02:47:16
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\utils\utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function formatAmount(amount) {
  if (isNaN(amount)) {
    return '0.00';
  }
  return Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


export function formattedDate(timer) {
  const date = new Date(timer);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}


export function splitNumberByProgress(startNumber, endNumber, parts) {
  const result = {};
  const step = 100 / parts; // 计算每一步的进度增量

  for (let i = 0; i <= parts; i++) {
    const progress = i * step; // 当前进度百分比
    // 计算当前进度对应的值，在起始值和结束值之间线性插值
    const value = (startNumber + (endNumber - startNumber) * progress / 100).toFixed(2);
    result[progress] = parseFloat(value); // 将字符串转换为浮点数
  }

  return result;
}


// WebSocket 封装，便于复用
export class SimpleWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = [];
    this.onOpenCallbacks = [];
    this.onCloseCallbacks = []; // ✅ 必须初始化
    this.onErrorCallbacks = []; // ✅ 必须初始化
  }

  connect() {
    if (this.ws) return;
    this.ws = new window.WebSocket(this.url);
    this.ws.onopen = () => {
      this.onOpenCallbacks.forEach(fn => fn());
    };
    this.ws.onmessage = (e) => {
      let data = e.data;
      try {
        data = JSON.parse(data);
      } catch {}
      this.listeners.forEach(fn => fn(data));
    };

    // ✅ 监听 close
    this.ws.onclose = (e) => {
      this.onCloseCallbacks.forEach(fn => fn(e));
    };

    // ✅ 监听 error
    this.ws.onerror = (err) => {
      this.onErrorCallbacks.forEach(fn => fn(err));
    };
  }

  send(msg) {
    console.log(this.ws, 'this.ws');

    if (!this.ws || this.ws.readyState !== 1) return;
    if (typeof msg !== 'string') msg = JSON.stringify(msg);
    this.ws.send(msg);
  }

  onMessage(fn) {
    this.listeners.push(fn);
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onOpen(fn) {
    this.onOpenCallbacks.push(fn);
  }

  // ✅ 新增 onClose
  onClose(fn) {
    this.onCloseCallbacks.push(fn);
  }

  // ✅ 新增 onError
  onError(fn) {
    this.onErrorCallbacks.push(fn);
  }
}