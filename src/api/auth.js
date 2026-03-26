import api from './index'

/**
 * 发送验证码
 * @param {Object} data
 * @param {string} data.target - 邮箱或手机号
 * @param {string} data.type - 验证类型: register, login, reset_password
 * @returns {Promise}
 */
export function sendCode(data) {
  return api.post('/v1/auth/send-code', data)
}

/**
 * 重置密码
 * @param {Object} data
 * @param {string} data.target - 邮箱或手机号
 * @param {string} data.code - 验证码
 * @param {string} data.new_password - 新密码(sha1)
 * @returns {Promise}
 */
export function resetPassword(data) {
  return api.post('/v1/auth/reset-password', data)
}
