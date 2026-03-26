import api from '../index'

/**
 * 获取管理员订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getAdminOrders(params) {
  return api.get('/v1/admin/orders', { params })
}

/**
 * 获取订单详情
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderDetails(orderId) {
  return api.get(`/v1/admin/orders/${orderId}`)
}

/**
 * 更新订单状态
 * @param {string} orderId - 订单ID
 * @param {string} status - 订单状态
 * @returns {Promise}
 */
export function updateOrderStatus(orderId, status) {
  return api.put(`/v1/admin/orders/${orderId}/status`, { status })
}

/**
 * 处理退款
 * @param {string} orderId - 订单ID
 * @param {Object} data - 退款数据
 * @returns {Promise}
 */
export function processRefund(orderId, data) {
  return api.post(`/v1/admin/orders/${orderId}/refund`, data)
}
