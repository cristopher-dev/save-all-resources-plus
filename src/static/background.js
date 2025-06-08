// Message handling from DevTools with improved logging and error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[BACKGROUND]: Received message:', message, 'from sender:', sender.id);
  
  if (message.action === 'getTab') {
    const tabId = message.tabId;
    
    // Validate tabId
    if (!tabId || tabId === 'unknown') {
      console.warn('[BACKGROUND]: Invalid tabId received:', tabId);
      sendResponse({ error: 'Invalid tabId', tabId: tabId });
      return true;
    }
    
    // Try to get tab info
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('[BACKGROUND]: Error getting tab:', chrome.runtime.lastError.message, 'TabId:', tabId);
        sendResponse({ error: chrome.runtime.lastError.message, tabId: tabId });
      } else {
        console.log('[BACKGROUND]: Successfully got tab info for tabId:', tabId);
        sendResponse({ success: true, tab: tab, tabId: tabId });
      }
    });
    
    return true; // Indicates the response will be async
  }
  
  // Handle other message types if any
  console.warn('[BACKGROUND]: Unknown message action:', message.action);
  sendResponse({ error: 'Unknown action', action: message.action });
  return true;
});

// Listener for extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[BACKGROUND]: Extension installed/updated:', details.reason);
});

// Listener for connection errors
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onConnect.addListener((port) => {
    console.log('[BACKGROUND]: New connection established:', port.name);
    
    port.onDisconnect.addListener(() => {
      console.log('[BACKGROUND]: Connection disconnected:', port.name);
      if (chrome.runtime.lastError) {
        console.error('[BACKGROUND]: Connection error:', chrome.runtime.lastError.message);
      }
    });
  });
});

console.log('[BACKGROUND]: Background script loaded and ready');
