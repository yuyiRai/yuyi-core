export function downloadFile(fileId, fileName) {
    var a = document.createElement('a');
    a.href = "/api/file/get?id=" + fileId;
    a.download = fileName || fileId;
    a.click();
    a.remove();
}
//# sourceMappingURL=downloadFile.js.map