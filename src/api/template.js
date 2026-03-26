import api from './index'

/**
 * 获取模板列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.category_id - 分类ID
 * @param {string} params.search - 搜索关键词
 * @param {string} params.sort - 排序方式
 * @returns {Promise}
 */
export function getTemplates(params) {
  return api.get('/v1/templates', { params })
}

/**
 * 获取模板详情
 * @param {string} id - 模板ID
 * @returns {Promise}
 */
export function getTemplateById(id, preview = false) {
  return api.get(`/v1/templates/${id}?preview=${preview}`)
}

/**
 * 获取分类列表
 * @returns {Promise}
 */
export function getCategories() {
  return api.get('/v1/categories')
}

/**
 * 获取分类下的模板
 * @param {string} categoryId - 分类ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getTemplatesByCategory(categoryId, params) {
  return api.get(`/v1/categories/${categoryId}/templates`, { params })
}

/**
 * 下载模板
 * @param {string} id - 模板ID
 * @returns {Promise}
 */
export function downloadTemplate(id) {
  return api.get(`/v1/templates/${id}/download`, {
    responseType: 'blob'
  })
}

/**
 * 获取模板预览URL
 * @param {string} id - 模板ID
 * @returns {Promise}
 */
export function getTemplatePreviewUrl(id) {
  return api.get(`/v1/templates/${id}/preview`)
}