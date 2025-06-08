const init = () => {
  try {
    // Use version 2.0.6 directly (current version)
    return chrome.devtools.panels.create('Web Resource Vault', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Web Resource Vault panel loaded successfully', panel);
    });
  } catch (error) {
    console.error('Error creating Web Resource Vault panel:', error);
    // Fallback in case of error
    return chrome.devtools.panels.create('Web Resource Vault', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Web Resource Vault panel loaded (fallback)', panel);
    });
  }
};

init();
