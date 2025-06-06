import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reset-css/reset.css';
import './global.scss';
import App from './devtoolApp';

// Función para verificar la disponibilidad de chrome.runtime con reintentos y fallbacks
const checkChromeRuntimeAvailability = (maxRetries = 15, retryDelay = 150) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      // Verificar contexto de extensión de manera más exhaustiva
      const isExtensionContextValid = () => {
        try {
          return (
            typeof chrome !== 'undefined' &&
            chrome.runtime &&
            typeof chrome.runtime.sendMessage === 'function' &&
            chrome.runtime.id // Verificar que el ID de la extensión esté disponible
          );
        } catch (error) {
          console.warn('[DEVTOOLS]: Extension context check failed:', error);
          return false;
        }
      };
      
      if (isExtensionContextValid()) {
        console.log(`[DEVTOOLS]: Extension context ready after ${attempts} attempts`);
        resolve(true);
        return;
      }
      
      if (attempts >= maxRetries) {
        const error = new Error(
          `Extension context not available after ${maxRetries} attempts. ` +
          `This may be due to extension reload, context invalidation, or timing issues.`
        );
        reject(error);
        return;
      }
      
      // Incrementar el delay gradualmente para casos difíciles
      const currentDelay = retryDelay + (attempts * 50);
      setTimeout(check, currentDelay);
    };
    
    check();
  });
};

// Función para obtener el tabId de forma segura
const getTabIdSafely = () => {
  try {
    if (chrome && chrome.devtools && chrome.devtools.inspectedWindow && 
        typeof chrome.devtools.inspectedWindow.tabId !== 'undefined') {
      return chrome.devtools.inspectedWindow.tabId;
    }
    return 'unknown';
  } catch (error) {
    console.warn('[DEVTOOLS]: Error getting tabId:', error);
    return 'unknown';
  }
};

// Función para enviar mensaje con manejo robusto de errores y reintentos
const sendGetTabMessage = async (retryCount = 0, maxRetries = 3) => {
  try {
    await checkChromeRuntimeAvailability();
    
    const tabId = getTabIdSafely();
    console.log(`[DEVTOOLS]: Sending getTab message for tabId: ${tabId} (attempt ${retryCount + 1})`);
    
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: 'getTab',
          tabId: tabId,
          timestamp: Date.now()
        },
        (response) => {
          if (chrome.runtime.lastError) {
            const error = new Error(`Runtime error: ${chrome.runtime.lastError.message}`);
            console.error(`[DEVTOOLS]: Error sending 'getTab' message: ${error.message}. TabId: ${tabId}, Attempt: ${retryCount + 1}`);
            
            // Reintentar si no hemos alcanzado el máximo
            if (retryCount < maxRetries) {
              console.log(`[DEVTOOLS]: Retrying in 500ms... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                sendGetTabMessage(retryCount + 1, maxRetries)
                  .then(resolve)
                  .catch(reject);
              }, 500);
            } else {
              reject(error);
            }
          } else {
            console.log(`[DEVTOOLS]: 'getTab' message sent successfully for tabId: ${tabId}`, response);
            resolve(response);
          }
        }
      );
    });
  } catch (error) {
    const tabId = getTabIdSafely();
    const errorMessage = `Failed to send 'getTab' message: ${error.message}. TabId: ${tabId}. Attempt: ${retryCount + 1}/${maxRetries + 1}`;
    
    console.error(`[DEVTOOLS]: ${errorMessage}`);
    
    // Reintentar si el error es potencialmente temporal
    if (retryCount < maxRetries && (
      error.message.includes('not available') || 
      error.message.includes('context') ||
      error.message.includes('timing')
    )) {
      console.log(`[DEVTOOLS]: Retrying due to potentially temporary error in 1000ms...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendGetTabMessage(retryCount + 1, maxRetries);
    }
    
    throw new Error(errorMessage);
  }
};

// Función adicional para verificar la disponibilidad completa de DevTools
const checkDevToolsCompleteAvailability = () => {
  try {
    // Verificación básica de chrome y runtime
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.debug('[DEVTOOLS]: Chrome runtime not available');
      return false;
    }

    // Verificación de contexto DevTools
    if (!chrome.devtools) {
      console.debug('[DEVTOOLS]: Chrome devtools not available');
      return false;
    }

    // Verificación de APIs específicas
    const checks = [
      { name: 'inspectedWindow', check: () => chrome.devtools.inspectedWindow },
      { name: 'network', check: () => chrome.devtools.network },
      { name: 'getResources', check: () => typeof chrome.devtools.inspectedWindow?.getResources === 'function' },
      { name: 'getHAR', check: () => typeof chrome.devtools.network?.getHAR === 'function' },
      { name: 'tabId', check: () => typeof chrome.devtools.inspectedWindow?.tabId !== 'undefined' }
    ];

    for (const { name, check } of checks) {
      if (!check()) {
        console.debug(`[DEVTOOLS]: ${name} not available`);
        return false;
      }
    }

    console.debug('[DEVTOOLS]: All DevTools APIs are available');
    return true;
  } catch (error) {
    console.warn('[DEVTOOLS]: DevTools context check failed:', error);
    return false;
  }
};

// Función de diagnóstico para DevTools
const diagnoseDevToolsContext = () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    chrome: typeof chrome !== 'undefined',
    runtime: !!(chrome && chrome.runtime),
    runtimeId: chrome?.runtime?.id || 'N/A',
    devtools: !!(chrome && chrome.devtools),
    inspectedWindow: !!(chrome && chrome.devtools && chrome.devtools.inspectedWindow),
    network: !!(chrome && chrome.devtools && chrome.devtools.network),
    panels: !!(chrome && chrome.devtools && chrome.devtools.panels),
    tabId: chrome?.devtools?.inspectedWindow?.tabId || 'N/A',
    apis: {},
    dependencies: {}
  };

  // Verificar APIs específicas
  if (chrome?.devtools?.inspectedWindow) {
    diagnostics.apis.getResources = typeof chrome.devtools.inspectedWindow.getResources === 'function';
    diagnostics.apis.eval = typeof chrome.devtools.inspectedWindow.eval === 'function';
    diagnostics.apis.reload = typeof chrome.devtools.inspectedWindow.reload === 'function';
  }

  if (chrome?.devtools?.network) {
    diagnostics.apis.getHAR = typeof chrome.devtools.network.getHAR === 'function';
    diagnostics.apis.onRequestFinished = typeof chrome.devtools.network.onRequestFinished === 'object';
  }

  // Verificar dependencias React
  diagnostics.dependencies = {
    React: typeof React !== 'undefined',
    ReactDOM: typeof ReactDOM !== 'undefined',
    createRoot: typeof ReactDOM?.createRoot === 'function',
    App: typeof App !== 'undefined',
    rootElement: !!document.getElementById('root')
  };

  console.group('[DEVTOOLS]: Context Diagnostics');
  console.table(diagnostics);
  console.groupEnd();
  
  return diagnostics;
};

// Función para verificar que todas las dependencias estén cargadas
const checkDependencies = () => {
  const deps = {
    React: typeof React !== 'undefined',
    ReactDOM: typeof ReactDOM !== 'undefined',
    createRoot: typeof ReactDOM !== 'undefined' && typeof ReactDOM.createRoot === 'function',
    App: typeof App !== 'undefined',
    rootElement: !!document.getElementById('root')
  };
  
  console.log('[DEVTOOLS]: Dependencies check:', deps);
  
  // Verificar si faltan dependencias críticas
  const missing = Object.entries(deps)
    .filter(([name, available]) => !available)
    .map(([name]) => name);
    
  if (missing.length > 0) {
    console.warn('[DEVTOOLS]: Missing dependencies:', missing);
  }
  
  return Object.values(deps).every(Boolean);
};

// Función de inicialización mejorada con mejor manejo de contexto
const ensureDevToolsContext = async (maxWaitTime = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkContext = () => {
      const elapsed = Date.now() - startTime;
      
      // Verificación más exhaustiva del contexto
      const isContextReady = () => {
        try {
          return (
            typeof chrome !== 'undefined' &&
            chrome.devtools &&
            chrome.devtools.inspectedWindow &&
            chrome.devtools.network &&
            typeof chrome.devtools.inspectedWindow.tabId !== 'undefined' &&
            chrome.devtools.inspectedWindow.tabId !== null
          );
        } catch (error) {
          console.debug('[DEVTOOLS]: Context check error:', error);
          return false;
        }
      };
      
      if (isContextReady()) {
        console.log(`[DEVTOOLS]: DevTools context ready after ${elapsed}ms`);
        resolve(true);
        return;
      }
      
      if (elapsed >= maxWaitTime) {
        console.warn(`[DEVTOOLS]: DevTools context timeout after ${elapsed}ms`);
        resolve(false); // No rechazar, permitir fallback
        return;
      }
      
      // Continuar verificando
      setTimeout(checkContext, 100);
    };
    
    checkContext();
  });
};

window.onload = async () => {
  console.log('[DEVTOOLS]: Window is loaded!');
  
  // Esperar a que el contexto DevTools esté disponible
  const contextReady = await ensureDevToolsContext();
  
  // Función para inicializar la aplicación con retry logic mejorado
  const initializeApp = (attempt = 1, maxAttempts = 15, forceInit = false) => {
    console.log(`[DEVTOOLS]: Initialization attempt ${attempt}/${maxAttempts}${forceInit ? ' (forced)' : ''}`);
    
    // Mostrar estado de inicialización
    if (attempt === 1 && !forceInit) {
      showInitStatus('Inicializando Web Resource Vault...', 'info', 0);
    } else if (forceInit) {
      showInitStatus('Inicializando en modo de respaldo...', 'warning', 0);
    } else if (attempt > 1) {
      showInitStatus(`Reintentando inicialización (${attempt}/${maxAttempts})...`, 'info', 0);
    }
    
    // Ejecutar diagnóstico cada 5 intentos para depuración
    if (attempt % 5 === 1 || attempt === maxAttempts || forceInit) {
      diagnoseDevToolsContext();
    }
    
    const hasContext = checkDevToolsCompleteAvailability();
    const hasDeps = checkDependencies();
    
    if ((hasContext && hasDeps) || forceInit) {
      const mode = forceInit ? 'fallback' : 'normal';
      console.log(`[DEVTOOLS]: Initializing React app in ${mode} mode`);
      
      // Inicializar la aplicación React
      const container = document.getElementById('root');
      if (container) {
        try {
          const root = ReactDOM.createRoot(container);
          root.render(<App />);
          console.log(`[DEVTOOLS]: React app initialized successfully in ${mode} mode`);
          
          // Mostrar estado de éxito
          showInitStatus(
            forceInit ? 
              'Inicializado en modo de respaldo. Algunas funciones pueden estar limitadas.' : 
              'Web Resource Vault inicializado correctamente',
            forceInit ? 'warning' : 'success',
            forceInit ? 0 : 2000
          );
          
          // Ocultar preloader si existe
          const preload = document.getElementById('preload');
          if (preload) {
            preload.style.display = 'none';
          }
          
          // Obtener información de la pestaña después de inicializar la aplicación
          // Solo si tenemos contexto DevTools completo
          if (hasContext && !forceInit) {
            setTimeout(async () => {
              try {
                await sendGetTabMessage();
              } catch (error) {
                console.warn('[DEVTOOLS]: Could not get tab info, but app is still functional:', error);
              }
            }, 100);
          }
          
          return; // Éxito, salir de la función
        } catch (error) {
          console.error(`[DEVTOOLS]: Error initializing React app in ${mode} mode:`, error);
          
          // Mostrar error en el estado
          showInitStatus(
            `Error en inicialización (${mode}): ${error.message}`,
            'error',
            0
          );
          
          // Si es el modo forzado y falla, mostrar mensaje de error crítico
          if (forceInit) {
            showCriticalError(container, error);
            return;
          }
        }
      } else {
        console.error('[DEVTOOLS]: Root container not found');
        showInitStatus('Error: Container #root no encontrado', 'error', 0);
        
        if (forceInit) {
          document.body.innerHTML = '<div style="padding: 20px; color: red;">Error crítico: Container #root no encontrado</div>';
          return;
        }
      }
    } else if (attempt < maxAttempts && !forceInit) {
      // Incrementar el tiempo de espera progresivamente, pero con un máximo
      const delay = Math.min(attempt * 300, 2000);
      console.log(`[DEVTOOLS]: Context not ready (hasContext: ${hasContext}, hasDeps: ${hasDeps}), retrying in ${delay}ms...`);
      
      // Mostrar estado de reintento
      const missingContext = !hasContext ? 'DevTools context' : '';
      const missingDeps = !hasDeps ? 'dependencies' : '';
      const missing = [missingContext, missingDeps].filter(Boolean).join(' y ');
      
      showInitStatus(`Esperando ${missing}... (${attempt}/${maxAttempts})`, 'info', delay + 100);
      
      setTimeout(() => initializeApp(attempt + 1, maxAttempts), delay);
      return;
    }
    
    // Si llegamos aquí, hemos agotado los intentos - inicializar en modo fallback
    if (!forceInit) {
      console.warn('[DEVTOOLS]: Maximum attempts reached, initializing in fallback mode');
      showInitStatus('Intentos agotados. Cambiando a modo de respaldo...', 'warning', 1000);
      setTimeout(() => initializeApp(1, 1, true), 1000);
      return;
    }
  };

  // Función para mostrar error crítico
  const showCriticalError = (container, error) => {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin: 20px;">
        <h3>Error de Inicialización</h3>
        <p>No se pudo inicializar Web Resource Vault correctamente.</p>
        <p>Error: ${error.message}</p>
        <p>Por favor, recarga la página o reinicia las DevTools.</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recargar
        </button>
      </div>
    `;
  };
  
  // Función para mostrar estado de inicialización
  const showInitStatus = (message, type = 'info', duration = 3000) => {
    const statusDiv = document.getElementById('init-status');
    if (!statusDiv) return;
    
    // Limpiar clases anteriores
    statusDiv.className = '';
    statusDiv.classList.add('show', type);
    statusDiv.textContent = message;
    
    // Auto-ocultar después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        statusDiv.classList.remove('show');
      }, duration);
    }
  };

  // Función para ocultar estado de inicialización
  const hideInitStatus = () => {
    const statusDiv = document.getElementById('init-status');
    if (statusDiv) {
      statusDiv.classList.remove('show');
    }
  };

  // Agregar un pequeño delay inicial para permitir que DevTools se estabilice
  setTimeout(() => {
    initializeApp();
  }, contextReady ? 100 : 1000);
};

// En el contexto de DevTools, chrome.tabs no está disponible directamente
// Usaremos chrome.runtime para comunicarnos con el background script
