// Helper para calcular profundidad y ciclos
export function calculateAllDepths(dependencies, stats) {
  const calculateDepth = (url, visited = new Set()) => {
    if (visited.has(url)) {
      stats.circularDependencies++;
      return 0;
    }
    visited.add(url);
    const resource = dependencies[url];
    if (!resource || resource.dependencies.length === 0) {
      return 0;
    }
    const maxDepth = Math.max(
      ...resource.dependencies.map(depUrl => calculateDepth(depUrl, new Set(visited)))
    );
    resource.depth = maxDepth + 1;
    return resource.depth;
  };
  Object.keys(dependencies).forEach(url => {
    calculateDepth(url);
  });
}
