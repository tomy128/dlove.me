/*
 * 转换图片为Base64编码
 * @param {File} file 图片文件对象
 * @returns {Promise<string>} 图片的Base64编码
 */
export const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}
