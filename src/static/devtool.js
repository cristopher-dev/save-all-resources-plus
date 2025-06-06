//console.log('Hello from -> Devtool');

const init = () => {
  try {
    // Usar directamente la versión 2.0.6 (versión actual)
    return chrome.devtools.panels.create('Web Resource Vault', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Web Resource Vault panel loaded successfully', panel);
    });
  } catch (error) {
    console.error('Error creating Web Resource Vault panel:', error);
    // Fallback en caso de error
    return chrome.devtools.panels.create('Web Resource Vault', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Web Resource Vault panel loaded (fallback)', panel);
    });
  }
};

init();
