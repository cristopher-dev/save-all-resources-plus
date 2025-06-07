// Helpers de descarga extraídos de file.js
import * as zip from '@zip.js/zip.js';

export const downloadBlobDirectly = (blob, filename) => {
  try {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    console.log('[DOWNLOAD]: File downloaded successfully:', filename);
  } catch (error) {
    console.error('[DOWNLOAD]: Error downloading file:', error);
  }
};

export const downloadIndividualFile = (resource, options = {}) => {
  return new Promise((resolve) => {
    try {
      let content = resource.content;
      let mimeType = resource.mimeType || 'application/octet-stream';
      let filename = resource.saveAs?.name || resource.url.split('/').pop() || 'resource';
      if (resource.encoding === 'base64') {
        const binaryString = atob(content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        content = bytes;
      }
      const blob = new Blob([content], { type: mimeType });
      downloadBlobDirectly(blob, filename);
      resolve({ success: true, filename });
    } catch (error) {
      console.error('Error downloading individual file:', error);
      resolve({ success: false, error: error.message });
    }
  });
};
