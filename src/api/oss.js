import api from './index'
import ossUploadClient from './ossUploadClient'


// 获取文件URL
/**
 * @param {string} fileKey 文件键
 * @returns {string} 文件URL
 */
export function getFileURL(fileKey) {
  return api.get(`/v1/oss/pre-sign/${fileKey}/url`).then(res => res.body.url)
}


/**
 * 通用文件预签名（直传）
 * @param {string} filename - 原始文件名
 * @param {string} contentType - 文件类型（可选）, 例如: image/jpeg zip
 * @returns Promise<{headers: Object, url: string, fileKey: string}>
 */
async function presignFileForUpload(filename, contentType) {
  const url = '/v1/oss/pre-sign'
  const body = {
    filename,
  }
  if (contentType) body.content_type = contentType
  const response = await api.post(url, body)
  console.log('response', response, response.body)
  return {
    headers: response.body?.signed_headers,
    url: response.body?.url,
    fileKey: response.body?.file_key
  }
}

/**
 * 通用文件直传OSS
 * 统一服务：预签名+直传
 * @param {File} file - 通用文件
 * @returns {Promise<{fileKey: string}>}
 */
export async function uploadFileDirect(file) {
  const { headers, url, fileKey } = await presignFileForUpload(file.name, file.type)
  if (!url || !fileKey) {
    throw new Error('获取文件预签名失败')
  }
  // 不携带任何请求头（除非签名返回明确 headers）
  await ossUploadClient.put(url, file, {
    headers,
  }).then().catch(err => Promise.reject(err))

  return { fileKey }
}
