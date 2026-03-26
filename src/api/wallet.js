import api from './index'

/**
 * 获取用户钱包信息
 * @returns {Promise}
 */
export function getWallet() {
  return api.get('/v1/wallet/get-or-create')
}

/**
 * 创建用户钱包
 * @returns {Promise}
 */
export function createWallet() {
  return api.post('/v1/wallet/create')
}

/**
 * 获取交易记录
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @param {string} params.type - 交易类型
 * @returns {Promise}
 */
export function getTransactions(params = {}) {
  return api.post('/v1/wallet/transactions', params)
}

// TODO: 交易详情功能待后端实现
/**
 * 获取交易详情
 * @param {string} transactionId - 交易ID
 * @returns {Promise}
 */
// export function getTransactionById(transactionId) {
//   return api.get(`/v1/wallet/transactions/${transactionId}`)
// }

/**
 * 钱包充值
 * @param {Object} data - 充值信息
 * @param {number} data.amount - 充值金额
 * @param {string} data.payment_method - 支付方式 (wechat/alipay)
 * @param {string} data.description - 充值描述
 * @returns {Promise}
 */
export function rechargeWallet(data) {
  return api.post('/v1/wallet/recharge', data)
}

/**
 * 钱包支付
 * @param {Object} data - 支付信息
 * @param {string} data.order_id - 订单ID
 * @param {number} data.amount - 支付金额
 * @param {string} data.description - 支付描述
 * @returns {Promise}
 */
export function walletPayment(data) {
  return api.post('/v1/wallet/pay', data)
}

/**
 * 获取钱包余额
 * @returns {Promise}
 */
export function getWalletBalance() {
  return api.get('/v1/wallet/balance')
}

// TODO: 以下密码相关功能待后端实现
/**
 * 验证钱包支付密码
 * @param {Object} data - 验证信息
 * @param {string} data.password - 支付密码
 * @returns {Promise}
 */
// export function verifyPaymentPassword(data) {
//   return api.post('/v1/wallet/verify-password', data)
// }

/**
 * 设置钱包支付密码
 * @param {Object} data - 密码信息
 * @param {string} data.password - 新支付密码
 * @param {string} data.confirm_password - 确认密码
 * @returns {Promise}
 */
// export function setPaymentPassword(data) {
//   return api.post('/v1/wallet/set-password', data)
// }

/**
 * 修改钱包支付密码
 * @param {Object} data - 密码信息
 * @param {string} data.old_password - 旧支付密码
 * @param {string} data.new_password - 新支付密码
 * @param {string} data.confirm_password - 确认密码
 * @returns {Promise}
 */
// export function changePaymentPassword(data) {
//   return api.post('/v1/wallet/change-password', data)
// }