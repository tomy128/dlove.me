import CryptoJS from 'crypto-js'

/**
 * SHA1加密
 * @param {string} text - 需要加密的文本
 * @returns {string} - 加密后的hex字符串
 */
export function sha1(text) {
  return CryptoJS.SHA1(text).toString(CryptoJS.enc.Hex)
}

/**
 * MD5加密
 * @param {string} text - 需要加密的文本
 * @returns {string} - 加密后的hex字符串
 */
export function md5(text) {
  return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
}

/**
 * Base64编码
 * @param {string} text - 需要编码的文本
 * @returns {string} - 编码后的字符串
 */
export function base64Encode(text) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
}

/**
 * Base64解码
 * @param {string} encodedText - 需要解码的文本
 * @returns {string} - 解码后的字符串
 */
export function base64Decode(encodedText) {
  return CryptoJS.enc.Base64.parse(encodedText).toString(CryptoJS.enc.Utf8)
}