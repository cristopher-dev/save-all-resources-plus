// Helpers para estadísticas de dependencias
import { getFileType, getFileExtension } from 'devtoolApp/utils/file';

export function getDependencyStats(resources) {
  const stats = {
    totalResources: resources.length,
    cssFiles: 0,
    jsFiles: 0,
    images: 0,
    fonts: 0,
    documents: 0,
    externalDependencies: 0,
    circularDependencies: 0,
  };
  resources.forEach((resource) => {
    const fileType = getFileType(resource.url);
    switch (fileType) {
      case 'css': stats.cssFiles++; break;
      case 'javascript': stats.jsFiles++; break;
      case 'images': stats.images++; break;
      case 'fonts': stats.fonts++; break;
      case 'documents': stats.documents++; break;
    }
  });
  return stats;
}
