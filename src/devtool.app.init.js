// Detección de tema más robusta con manejo de errores
let devToolTheme;
try {
  devToolTheme = chrome && chrome.devtools && chrome.devtools.panels && chrome.devtools.panels['themeName'];
} catch (error) {
  console.warn('[DEVTOOL]: Error accessing theme, using default light theme:', error);
  devToolTheme = 'light';
}

const preload = document.getElementById('preload');

// Configurar tema con fallback
window.theme = (devToolTheme && typeof devToolTheme === 'string' && devToolTheme.toLowerCase().includes('dark')) ? 'dark' : 'light';

if (preload) {
  preload.setAttribute(`data-${window.theme}`, '');
}

console.log(`[DEVTOOL]: Theme Detection: "${window.theme}" (source: ${devToolTheme || 'fallback'})`);
