import api from '../index'

/**
 * 获取用户列表（管理员）
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getUsers(params) {
  return api.get('/v1/admin/users', { params })
}

/**
 * 获取用户购买记录（管理员）
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function getUserPurchases(userId) {
  return api.get(`/v1/admin/users/${userId}/purchases`)
}

/**
 * 更新用户状态（管理员）
 * @param {string} userId - 用户ID
 * @param {string} status - 用户状态
 * @returns {Promise}
 */
export function updateUserStatus(userId, status) {
  return api.put(`/v1/admin/users/${userId}/status`, { status })
}

/**
 * 更新用户角色（管理员）
 * @param {string} userId - 用户ID
 * @param {string} role - 用户角色
 * @returns {Promise}
 */
export function updateUserRole(userId, role) {
  return api.put(`/v1/admin/users/${userId}/role`, { role })
}

/**
 * 重置用户密码（管理员）
 * @param {string} userId - 用户ID
 * @returns {Promise}
 */
export function resetUserPassword(userId) {
  return api.post(`/v1/admin/users/${userId}/reset-password`)
}
