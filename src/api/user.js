import api from './index'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return api.post('/v1/users/login', data)
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @param {string} data.nickname - 昵称
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function register(data) {
  return api.post('/v1/users/register', data)
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return api.post('/v1/users/logout')
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return api.get('/v1/users/me')
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @param {string} [data.nickname] - 昵称
 * @param {string} [data.avatar] - 头像URL
 * @param {string} [data.bio] - 个人简介
 * @param {string} [data.gender] - 性别
 * @param {string} [data.currentPassword] - 当前密码（修改密码时需要）
 * @param {string} [data.newPassword] - 新密码
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return api.put('/v1/users/me', data)
}

/**
 * 更新自定义域名
 * @param {Object} data - 自定义域名信息
 * @param {string} data.custom_domain - 自定义域名
 * @returns {Promise}
 */
export function updateCustomDomain(data) {
  return api.put('/v1/users/me/custom-domain', data)
}

/**
 * 更新密码
 * @param {Object} data - 密码信息
 * @returns {Promise}
 */
export function changePassword(data) {
  return api.post('/v1/users/me/change-password', data)
}

/**
 * 绑定邮箱
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.code
 * @param {string} [data.password]
 * @returns {Promise}
 */
export function bindEmail(data) {
  return api.post('/v1/users/bind/email', data)
}

/**
 * 绑定手机号
 * @param {Object} data
 * @param {string} data.phone
 * @param {string} data.code
 * @returns {Promise}
 */
export function bindPhone(data) {
  return api.post('/v1/users/bind/phone', data)
}

/**
 * 解绑身份
 * @param {Object} data
 * @param {string} data.type - email, phone, qq, wechat
 * @returns {Promise}
 */
export function unbindIdentity(data) {
  return api.post('/v1/users/unbind', data)
}
