import api from '../index'

/**
 * 获取管理后台统计数据
 * @param {Object} params - 查询参数
 * @param {string} [params.period] - 统计周期 (day/week/month/year)
 * @returns {Promise}
 */
export function getStatistics(params) {
  return api.get('/v1/admin/statistics', { params })
}

/**
 * 获取销售趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 统计周期 (day/week/month/year)
 * @param {string} [params.start_date] - 开始日期
 * @param {string} [params.end_date] - 结束日期
 * @returns {Promise}
 */
export function getSalesTrend(params) {
  return api.get('/v1/admin/statistics/sales-trend', { params })
}

/**
 * 获取热门模板数据
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量
 * @returns {Promise}
 */
export function getTopTemplates(params) {
  return api.get('/v1/admin/statistics/top-templates', { params })
}

/**
 * 获取最近订单数据
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量
 * @returns {Promise}
 */
export function getRecentOrders(params) {
  return api.get('/v1/admin/statistics/recent-orders', { params })
}

/**
 * 获取最新用户数据
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量
 * @returns {Promise}
 */
export function getRecentUsers(params) {
  return api.get('/v1/admin/statistics/recent-users', { params })
}

/**
 * 获取用户增长数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 统计周期 (day/week/month/year)
 * @returns {Promise}
 */
export function getUserGrowth(params) {
  return api.get('/v1/admin/statistics/user-growth', { params })
}
