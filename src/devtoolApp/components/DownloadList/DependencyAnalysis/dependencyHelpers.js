// Helpers para análisis de dependencias
import { getFileType, getFileExtension } from 'devtoolApp/utils/file';
import { getDependencyStats } from './dependencyStats';
import { buildDependencyGraph, addDependents } from './dependencyGraph';
import { calculateAllDepths } from './dependencyDepth';
import { getCriticalPath } from './criticalPath';

export function analyzeDependenciesFromList(downloadList) {
  if (downloadList.length <= 1) return { dependencies: {}, stats: {}, criticalPath: [] };

  const resources = downloadList.slice(1); // Excluir la página principal
  const mainDomain = downloadList[0] ? new URL(downloadList[0].url).hostname : '';
  const stats = getDependencyStats(resources);
  const dependencies = buildDependencyGraph(resources, mainDomain);
  addDependents(dependencies);
  calculateAllDepths(dependencies, stats);
  const criticalPath = getCriticalPath(dependencies);

  return { dependencies, stats, criticalPath };
}
