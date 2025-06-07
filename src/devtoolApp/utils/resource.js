import * as networkResourceActions from 'devtoolApp/store/networkResource';
import * as staticResourceActions from 'devtoolApp/store/staticResource';
import { flashStatus } from 'devtoolApp/store/ui';
import { resolveURLToPath } from './url';
import { debounce, logIfDev } from './general';
import * as downloadLogActions from '../store/downloadLog';

export const SOURCES = {
  STATIC: 'STATIC',
  NETWORK: 'NETWORK',
};

export const flashStatusDebounced = debounce((dispatch, message, timeout = 1000) => {
  logIfDev(`[FLASH STATUS]: ${message}`);
  dispatch(flashStatus(message, timeout));
}, 50);

export const processNetworkResourceToStore = (dispatch, res) => {
  console.log('[NETWORK RESOURCE PROCESSING]: Starting process for:', res.request?.url);
  // logIfDev('[NETWORK] Resource: ', res);
  flashStatusDebounced(dispatch, `[NETWORK] Processing: ${res.request?.url || `No Url`}`);
  if (res.request?.url && !res.request.url.match(`^(debugger:|chrome-extension:|ws:)`)) {
    // console.log('[NETWORK RESOURCE PROCESSING]: URL passed filter, getting content...');
    res.getContent((content, encoding) => {
      // console.log('[NETWORK RESOURCE PROCESSING]: Content retrieved, length:', content?.length || 0);
      const uriDataTypeMatches = res.request.url.match(/^data:(?<dataType>.*?);/);
      const uriDataType = uriDataTypeMatches?.groups?.dataType;
      const mimeType = res.response?.content?.mimeType;
      const contentTypeHeader = res.response?.headers?.find((i) => i.name.toLowerCase().includes('content-type'));
      const contentTypeMatches = contentTypeHeader?.value?.match(/^(?<contentType>.*?);/);
      const contentType = contentTypeMatches?.groups?.contentType;
      const type = uriDataType || mimeType || contentType;
      
      const resourceData = {
        source: SOURCES.NETWORK,
        url: res.request.url,
        type,
        content,
        encoding,
        origin: res,
        saveAs: resolveURLToPath(res.request.url, type, content),
      };
      
      console.log('[NETWORK RESOURCE PROCESSING]: Adding to store:', resourceData.url, resourceData.type);
      dispatch(networkResourceActions.addNetworkResource(resourceData));
    });
  }
};

export const processStaticResourceToStore = (dispatch, res) => {
  console.log('[STATIC RESOURCE PROCESSING]: Starting process for:', res.url);
  // logIfDev('[STATIC] Resource: ', res);
  if (!res.url.match(`^(debugger:|chrome-extension:|ws:)`)) {
    console.log('[STATIC RESOURCE PROCESSING]: URL passed filter, getting content...');
    flashStatusDebounced(dispatch, `[STATIC] Processing a resource: ${res.url || `No Url`}`);
    res.getContent(async (content, encoding) => {
      console.log('[STATIC RESOURCE PROCESSING]: Content retrieved, length:', content?.length || 0, 'encoding:', encoding);
      const meta = {
        source: SOURCES.STATIC,
        url: res.url,
        type: res.type,
        content,
        encoding,
        origin: res,
        saveAs: resolveURLToPath(res.url, res.type, content),
      };
      console.log('[STATIC RESOURCE PROCESSING]: Created meta object:', meta.url, meta.type);
      
      // If content is a promise
      if (content?.then) {
        try {
          console.log('[STATIC RESOURCE PROCESSING]: Content is a promise, awaiting...');
          meta.content = await content;
          console.log('[STATIC RESOURCE PROCESSING]: Promise resolved, content length:', meta.content?.length || 0);
        } catch {
          console.log('[STATIC RESOURCE PROCESSING]: Promise rejected, setting content to null');
          meta.content = null;
          meta.failed = true;
        }
      }
      // Si hay contenido en memoria, agregar directamente y NO intentar fetch
      if (meta.content) {
        console.log('[STATIC RESOURCE PROCESSING]: Content in memory, adding to static resource store:', meta.url);
        dispatch(staticResourceActions.addStaticResource(meta));
        return;
      }
      // Si no hay contenido y la URL es http, intentar fetch
      if (!meta.content && res.url.startsWith('http')) {
        // console.log('[STATIC RESOURCE PROCESSING]: No content from memory, trying to fetch directly:', res.url);
        fetch(res.url)
          .then(async (retryRequest) => {
            if (retryRequest.ok) {
              // console.log('[STATIC RESOURCE PROCESSING]: Direct fetch successful');
              meta.content = await retryRequest.blob();
            } else {
              // console.log('[STATIC RESOURCE PROCESSING]: Direct fetch failed');
              meta.failed = true;
            }
            // console.log('[STATIC RESOURCE PROCESSING]: Adding to static resource store:', meta.url);
            dispatch(staticResourceActions.addStaticResource(meta));
          })
          .catch((err) => {
            // console.log(`[STATIC RESOURCE PROCESSING]: Error fetching ${res.url}`, err);
            meta.failed = true;
            // console.log('[STATIC RESOURCE PROCESSING]: Adding failed resource to store:', meta.url);
            dispatch(staticResourceActions.addStaticResource(meta));
          });
      } else {
        // console.log('[STATIC RESOURCE PROCESSING]: Adding to static resource store:', meta.url);
        dispatch(staticResourceActions.addStaticResource(meta));
      }
    });
  }
};

export const logResourceByUrl = (dispatch, url, resources) => {
  // console.debug(`[ALL] Now log resource state from url: `, url);
  dispatch(
    downloadLogActions.addLogItem({
      url: url,
      logs: resources.map((i) => ({
        failed: i.failed,
        hasContent: !!i.content,
        url: i.url,
        saveAs: i.saveAs,
      })),
    })
  );
};
