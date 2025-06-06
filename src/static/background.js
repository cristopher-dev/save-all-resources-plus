// Manejo de mensajes desde DevTools con mejor logging y manejo de errores
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[BACKGROUND]: Received message:', message, 'from sender:', sender.id);
  
  if (message.action === 'getTab') {
    const tabId = message.tabId;
    
    // Validar tabId
    if (!tabId || tabId === 'unknown') {
      console.warn('[BACKGROUND]: Invalid tabId received:', tabId);
      sendResponse({ error: 'Invalid tabId', tabId: tabId });
      return true;
    }
    
    // Intentar obtener información de la pestaña
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        console.error('[BACKGROUND]: Error getting tab:', chrome.runtime.lastError.message, 'TabId:', tabId);
        sendResponse({ 
          error: chrome.runtime.lastError.message, 
          tabId: tabId 
        });
      } else {
        console.log('[BACKGROUND]: Successfully got tab info for tabId:', tabId);
        sendResponse({ 
          success: true, 
          tab: tab, 
          tabId: tabId 
        });
      }
    });
    
    return true; // Indica que la respuesta será asíncrona
  }
  
  // Manejar otros tipos de mensajes si los hay
  console.warn('[BACKGROUND]: Unknown message action:', message.action);
  sendResponse({ error: 'Unknown action', action: message.action });
  return true;
});

// Listener para cuando la extensión se instala o actualiza
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[BACKGROUND]: Extension installed/updated:', details.reason);
});

// Listener para detectar errores de conexión
chrome.runtime.onConnect.addListener((port) => {
  console.log('[BACKGROUND]: New connection established:', port.name);
  
  port.onDisconnect.addListener(() => {
    console.log('[BACKGROUND]: Connection disconnected:', port.name);
    if (chrome.runtime.lastError) {
      console.error('[BACKGROUND]: Connection error:', chrome.runtime.lastError.message);
    }
  });
});

console.log('[BACKGROUND]: Background script loaded and ready');
