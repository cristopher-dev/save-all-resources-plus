// Helpers para grafo de dependencias
import { getFileType } from 'devtoolApp/utils/file';

export function buildDependencyGraph(resources, mainDomain) {
  const dependencies = {};
  resources.forEach((resource) => {
    const url = new URL(resource.url);
    const fileType = getFileType(resource.url);
    const resourceDeps = [];
    if (fileType === 'css') {
      const cssImages = resources.filter(r => getFileType(r.url) === 'images' && new URL(r.url).hostname === url.hostname);
      const cssFonts = resources.filter(r => getFileType(r.url) === 'fonts' && new URL(r.url).hostname === url.hostname);
      resourceDeps.push(...cssImages.map(r => r.url), ...cssFonts.map(r => r.url));
    }
    if (fileType === 'javascript') {
      const jsImages = resources.filter(r => getFileType(r.url) === 'images' && new URL(r.url).hostname === url.hostname);
      resourceDeps.push(...jsImages.map(r => r.url));
    }
    dependencies[resource.url] = {
      dependencies: resourceDeps,
      dependents: [],
      domain: url.hostname,
      type: fileType,
      size: resource.size || 0,
      extension: resource.extension,
      depth: 0,
      critical: false,
    };
  });
  return dependencies;
}

export function addDependents(dependencies) {
  Object.keys(dependencies).forEach(resourceUrl => {
    dependencies[resourceUrl].dependencies.forEach(depUrl => {
      if (dependencies[depUrl]) {
        dependencies[depUrl].dependents.push(resourceUrl);
      }
    });
  });
}
