import api from '../index'

/**
 * 获取管理员分类列表
 * @returns {Promise}
 */
export function getAdminCategories() {
  return api.get('/v1/admin/categories')
}

/**
 * 创建分类
 * @param {Object} categoryData - 分类数据
 * @returns {Promise}
 */
export function createCategory(categoryData) {
  return api.post('/v1/admin/categories', categoryData)
}

/**
 * 更新分类
 * @param {string} id - 分类ID
 * @param {Object} categoryData - 分类数据
 * @returns {Promise}
 */
export function updateCategory(id, categoryData) {
  return api.put(`/v1/admin/categories/${id}`, categoryData)
}

/**
 * 删除分类
 * @param {string} id - 分类ID
 * @returns {Promise}
 */
export function deleteCategory(id) {
  return api.delete(`/v1/admin/categories/${id}`)
}