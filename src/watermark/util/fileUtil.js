/**
 * 是否是有效文件
 * @param {*} file 文件
 * @returns
 */
export function isFileValid(file) {
  if (!file) return false;
  return file.name && file.name.trim() !== '' && file.size > 0;
}

/**
 * 读取文件内容
 * @param {*} file
 * @returns
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * 将Data URL转换为Blob对象
 * @param {string} dataURI - Data URL字符串
 * @returns {Blob} - Blob对象
 */
export function dataURItoBlob(dataURI) {
  // 分离MIME类型和base64编码的数据
  const byteString = atob(dataURI.split(',')[1]);

  // 提取MIME类型
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // 将字节字符串转换为字节数组
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
