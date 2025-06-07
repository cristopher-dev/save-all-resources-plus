// Helpers para simulación y formateo de compresión

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function simulateCompressionStats(downloadList, selectedFormat, compressionLevel, COMPRESSION_FORMATS) {
  if (downloadList.length <= 1) return { totalFiles: 0, originalSize: 0, estimatedSize: 0, estimatedRatio: 0, spaceSaved: 0 };
  const resources = downloadList.slice(1);
  const totalFiles = resources.length;
  const originalSize = resources.reduce((sum, item) => {
    const extension = item.url.split('.').pop()?.toLowerCase() || '';
    let estimatedSize = 50 * 1024;
    if (["jpg","jpeg","png","gif","webp"].includes(extension)) {
      estimatedSize = Math.random() * 500 * 1024 + 100 * 1024;
    } else if (["js","css"].includes(extension)) {
      estimatedSize = Math.random() * 200 * 1024 + 20 * 1024;
    } else if (["html","htm"].includes(extension)) {
      estimatedSize = Math.random() * 100 * 1024 + 10 * 1024;
    }
    return sum + estimatedSize;
  }, 0);
  const format = COMPRESSION_FORMATS[selectedFormat];
  const levelMultiplier = compressionLevel === 1 ? 0.9 : compressionLevel === 3 ? 0.8 : compressionLevel === 6 ? 0.7 : 0.6;
  const estimatedRatio = format.averageRatio * levelMultiplier / 100;
  const estimatedSize = originalSize * (1 - estimatedRatio);
  return {
    totalFiles,
    originalSize,
    estimatedSize,
    estimatedRatio: Math.round(estimatedRatio * 100),
    spaceSaved: originalSize - estimatedSize
  };
}
