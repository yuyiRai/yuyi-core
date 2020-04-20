/* istanbul ignore next */
/**
 * 
 * @param fileId 
 * @param fileName 
 * @param getUrl 
 * @example
 * downloadFile('idxxx', 'test.xxx', id => `/api/file/get?id=${id}`)
 */
export function downloadFile(fileId: string, fileName: string, getUrl: ((id: string) => string)) {
  const a = document.createElement('a');
  a.href = getUrl(fileId);
  a.download = fileName || fileId;
  a.click();
  a.remove();
}
