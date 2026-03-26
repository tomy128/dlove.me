import api from '../index'

/**
 * 获取管理员模板列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getAdminTemplates(params) {
  return api.get('/v1/admin/templates', { params })
}

/**
 * 获取模板详情
 * @param {string} id - 模板ID
 * @returns {Promise}
 */
export function getTemplate(id) {
  return api.get(`/v1/admin/templates/${id}`)
}

/**
 * 创建模板
 * @param {Object} templateData - 模板数据
 * @returns {Promise}
 */
export function createTemplate(templateData) {
  return api.post('/v1/admin/templates', templateData)
}

/**
 * 更新模板
 * @param {Object} templateData - 模板数据
 * @returns {Promise}
 */
export function updateTemplate(templateData) {
  return api.put(`/v1/admin/templates/${templateData.id}`, templateData)
}

/**
 * 删除模板
 * @param {string} id - 模板ID
 * @returns {Promise}
 */
export function deleteTemplate(id) {
  return api.delete(`/v1/admin/templates/${id}`)
}

/**
 * 更新模板状态
 * @param {string} id - 模板ID
 * @param {number} status - 状态（0-禁用，1-启用）
 * @returns {Promise}
 */
export function updateTemplateStatus(id, status) {
  return api.patch(`/v1/admin/templates/${id}/status`, { status })
}
