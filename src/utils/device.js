/**
 * 设备检测工具函数
 */

/**
 * 检查当前设备是否为移动端
 * 综合判断：屏幕宽度 < 1024 或者 UserAgent 包含移动端标识
 * @returns {boolean} True if mobile device
 */
export const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const widthCheck = window.innerWidth < 1024;
  const uaCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return widthCheck || uaCheck;
};

/**
 * 复制到剪贴板
 * @param {string} text - 要复制的文本
 */
export const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    // 现代浏览器 + 安全上下文
    navigator.clipboard.writeText(text).then(() => {
      console.log('复制成功');
    }).catch(() => {
      console.error('复制失败');
    });
  } else {
    // 降级方案：使用传统的 execCommand('copy')
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('复制成功');
    } catch (err) {
      console.error('复制失败');
    }
    document.body.removeChild(textArea);
  }
};
