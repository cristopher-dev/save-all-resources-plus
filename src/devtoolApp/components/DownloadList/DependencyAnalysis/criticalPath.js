// Helper para identificar ruta crítica
export function getCriticalPath(dependencies) {
  return Object.entries(dependencies)
    .filter(([_, resource]) => resource.dependents.length > 2 || resource.depth > 3)
    .sort((a, b) => b[1].dependents.length - a[1].dependents.length)
    .slice(0, 5)
    .map(([url]) => {
      dependencies[url].critical = true;
      return url;
    });
}
