import { Toast, Mask } from 'antd-mobile';

let loadingKey = null;

/**
 * 显示全局Loading
 * @param {string} content 加载提示内容
 */
export function showLoading(content = '加载中...') {
  if (loadingKey) return;
  loadingKey = Toast.show({
    icon: 'loading', // 让背景变暗
    content,
    duration: 0, // 不自动关闭
    maskClickable: false,
  });
}

/**
 * 隐藏全局Loading
 */
export function hideLoading() {
  if (loadingKey) {
    loadingKey.close();
    loadingKey = null;
  }
}
