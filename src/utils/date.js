/**
 * 日期工具函数
 */

/**
 * 格式化日期
 * @param {string|Date|number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式模板，支持:
 *   - 'YYYY-MM-DD HH:mm:ss' (默认)
 *   - 'YYYY-MM-DD'
 *   - 'short' (例如: 12月16日)
 *   - 'time' (例如: 14:30)
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  // 检查无效日期
  if (isNaN(d.getTime())) return ''

  // 特殊预设格式
  if (format === 'short') {
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
  if (format === 'long-date') {
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
  }

  const pad = (n) => String(n).padStart(2, '0')
  
  const map = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds())
  }

  // 如果没有匹配到预设，则执行简单的模板替换
  // 注意：这里只支持简单的 YYYY, MM, DD, HH, mm, ss 替换
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match])
}

/**
 * 相对时间格式化 (例如: 刚刚, 5分钟前)
 * @param {string|Date} date 
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = (now - d) / 1000

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  
  return formatDate(date, 'YYYY-MM-DD')
}
