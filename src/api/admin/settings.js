import api from './index'

/**
 * 获取系统基本设置
 * @returns {Promise}
 */
export function getGeneralSettings() {
  return api.get('/v1/admin/settings/general')
}

/**
 * 更新系统基本设置
 * @param {Object} data - 设置数据
 * @returns {Promise}
 */
export function updateGeneralSettings(data) {
  return api.post('/v1/admin/settings/general', data)
}

/**
 * 获取支付设置
 * @returns {Promise}
 */
export function getPaymentSettings() {
  return api.get('/v1/admin/settings/payment')
}

/**
 * 更新支付宝设置
 * @param {Object} data - 支付宝设置数据
 * @returns {Promise}
 */
export function updateAlipaySettings(data) {
  return api.post('/v1/admin/settings/payment/alipay', data)
}

/**
 * 更新微信支付设置
 * @param {Object} data - 微信支付设置数据
 * @returns {Promise}
 */
export function updateWechatSettings(data) {
  return api.post('/v1/admin/settings/payment/wechat', data)
}

// 旧的直传服务器上传接口已移除，统一改为 OSS 预签名直传
