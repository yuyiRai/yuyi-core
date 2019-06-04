export function downloadFile(fileId: string, fileName: string) {
  const a = document.createElement('a');
  a.href = `/api/file/get?id=${fileId}`;
  a.download = fileName || fileId;
  a.click();
  a.remove();
}