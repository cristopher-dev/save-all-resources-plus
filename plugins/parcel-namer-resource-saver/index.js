const { Namer } = require('@parcel/plugin');
const path = require('path');

const filenames = [];

const handleDuplicatedName = (filename) => {
  if (filenames.includes(filename)) {
    const ext = path.extname(filename);
    const regEx = new RegExp(`${ext}$`);
    filenames.push(filename.replace(regEx, `.d${ext}`));
  } else {
    filenames.push(filename);
  }
  return filenames[filenames.length - 1];
};

module.exports = new Namer({
  name({ bundle }) {
    try {
      const mainEntry = bundle.getMainEntry();
      if (!mainEntry || !mainEntry.filePath) {
        return null; // Let Parcel handle the naming for bundles without a main entry or filePath
      }
      
      const filePath = mainEntry.filePath;
      const ext = path.extname(filePath);
      if (ext.endsWith('css')) {
        return path.basename(filePath);
      }
      if (filePath.includes('src/static/fonts')) {
        return `fonts/${path.basename(filePath)}`;
      }
      if (path.dirname(filePath).endsWith('/src')) {
        return handleDuplicatedName(path.basename(filePath));
      }
      return null;
    } catch (error) {
      console.error('Error in parcel-namer-resource-saver:', error);
      return null; // Fallback to default naming
    }
  },
});
