import api from './index'

/**
 * 创建订单
 * @param {Object} data - 订单信息
 * @param {string} data.template_id - 模板ID
 * @returns {Promise}
 */
export function createOrder(data) {
  return api.post('/v1/orders', data)
}

/**
 * 更新订单配置
 * @param {string} id - 订单ID
 * @param {Object} data - 更新数据
 * @param {Object} data.config_data - 配置数据
 * @returns {Promise}
 */
export function updateOrder(id, data) {
  return api.put(`/v1/orders/${id}`, data)
}

/**
 * 更新分享配置 (Slug)
 * @param {string} id - 订单ID
 * @param {string} slug - 分享Slug
 * @returns {Promise}
 */
export function updateShareSlug(id, slug) {
  return api.put(`/v1/orders/${id}/share`, { slug })
}

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOrders(params) {
  return api.get('/v1/orders', { params })
}

/**
 * 获取订单详情
 * @param {string} id - 订单ID
 * @returns {Promise}
 */
export function getOrderById(id) {
  return api.get(`/v1/orders/${id}`)
}

/**
 * 通过分享Slug获取订单详情
 * @param {string} slug - 分享Slug
 * @returns {Promise}
 */
export function getOrderByShareSlug(slug) {
  return api.get(`/v1/orders/share/${slug}`)
}

/**
 * 获取订单详情 (别名)
 * @param {string} id - 订单ID
 * @returns {Promise}
 */
export const getOrderDetail = getOrderById

/**
 * 取消订单
 * @param {string} id - 订单ID
 * @param {Object} data - 取消信息
 * @param {string} data.cancel_reason - 取消原因
 * @returns {Promise}
 */
export function cancelOrder(id, data) {
  return api.post(`/v1/orders/${id}/cancel`, data)
}

/**
 * 申请退款
 * @param {string} id - 订单ID
 * @param {Object} data - 退款信息
 * @param {string} data.refund_reason - 退款原因
 * @returns {Promise}
 */
export function refundOrder(id, data) {
  return api.post(`/v1/orders/${id}/refund`, data)
}

/**
 * 删除订单
 * @param {string} id - 订单ID
 * @returns {Promise}
 */
export function deleteOrder(id) {
  return api.delete(`/v1/orders/${id}`)
}

/**
 * 创建支付
 * @param {Object} data - 支付信息
 * @param {string} data.order_id - 订单ID
 * @param {string} data.payment_method - 支付方式 (wechat/alipay)
 * @returns {Promise}
 */
export function createPayment({ order_id, payment_method }) {
  return api.post(`/v1/orders/${order_id}/payments`, { payment_method })
}

/**
 * 获取支付详情
 * @param {string} id - 支付ID
 * @returns {Promise}
 */
export function getPaymentById(id) {
  return api.get(`/v1/payments/${id}`)
}

/**
 * 验证支付状态
 * @param {Object} data - 验证信息
 * @param {string} data.payment_id - 支付ID
 * @returns {Promise}
 */
export function verifyPayment(data) {
  return api.post('/v1/payments/verify', data)
}

/**
 * 获取订单支付记录
 * @param {string} orderId - 订单ID
 * @returns {Promise}
 */
export function getOrderPayments(orderId) {
  return api.get(`/v1/orders/${orderId}/payments`)
}

/**
 * 获取用户购买记录
 * @param {Object} params - 查询参数 { page, limit }
 * @returns {Promise}
 */
export function getUserPurchases(params) {
  return api.get('/v1/orders/user/purchases', { params })
}
