import api from './index'

/**
 * 下载作品源码
 * @param {string} id - 作品ID
 * @returns {Promise}
 */
export function downloadWork(id) {
  return api.get(`/v1/works/${id}/download`, {
    responseType: 'blob'
  })
}
