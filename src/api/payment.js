import api from './index'

/**
 * 创建支付
 * @param {Object} data - 支付信息
 * @param {string} data.order_id - 订单ID
 * @param {string} data.payment_method - 支付方式
 * @param {number} data.amount - 支付金额
 * @returns {Promise}
 */
export function createPayment(data) {
  return api.post('/v1/payments', data)
}

/**
 * 获取支付详情/状态
 * @param {string} paymentId - 支付ID
 * @returns {Promise}
 */
export function getPaymentById(paymentId) {
  return api.get(`/v1/payments/${paymentId}`)
}

/**
 * 验证支付状态
 * @param {Object} data - 验证信息
 * @param {string} data.payment_id - 支付ID
 * @param {string} data.transaction_id - 第三方交易ID
 * @returns {Promise}
 */
export function verifyPayment(data) {
  return api.post('/v1/payments/verify', data)
}