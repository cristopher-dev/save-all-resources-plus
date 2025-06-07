// Helpers para simulación y formateo de caché

export function simulateCacheData(downloadList, cachePolicy, compressionRatio, CACHE_POLICIES) {
  if (downloadList.length <= 1) return { cache: {}, totalSize: 0 };
  const simulatedCache = {};
  let totalSize = 0;
  downloadList.slice(1).forEach((item) => {
    const url = item.url;
    const hash = btoa(url).substring(0, 12);
    const originalSize = Math.floor(Math.random() * 500 + 50) * 1024; // 50KB - 550KB
    const compressedSize = Math.floor(originalSize * (100 - compressionRatio) / 100);
    const cachedAt = new Date(Date.now() - Math.random() * 86400000);
    const accessCount = Math.floor(Math.random() * 20 + 1);
    simulatedCache[hash] = {
      url,
      hash,
      originalSize,
      compressedSize,
      cachedAt,
      lastAccessed: new Date(cachedAt.getTime() + Math.random() * 86400000),
      accessCount,
      contentType: item.mimeType || 'application/octet-stream',
      compressionAlgorithm: 'gzip',
      ttl: CACHE_POLICIES[cachePolicy].ttl,
      isExpired: Date.now() - cachedAt.getTime() > CACHE_POLICIES[cachePolicy].ttl
    };
    totalSize += compressedSize;
  });
  return { cache: simulatedCache, totalSize };
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatTime(date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
