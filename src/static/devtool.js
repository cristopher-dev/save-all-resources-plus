const init = () => {
  try {
    // Use version 2.0.6 directly (current version)
    return chrome.devtools.panels.create('Save All Resources plus', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Save All Resources plus panel loaded successfully', panel);
    });
  } catch (error) {
    console.error('Error creating Save All Resources plus panel:', error);
    // Fallback in case of error
    return chrome.devtools.panels.create('Save All Resources plus', 'icon.png', 'devtool.app.html', function (panel) {
      console.log('Save All Resources plus panel loaded (fallback)', panel);
    });
  }
};

init();
