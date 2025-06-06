import { getReducerConfig } from '../utils';

export const STATE_KEY = `option`;

export const ACTIONS = {
  SET_IGNORE_NO_CONTENT_FILE: 'SET_IGNORE_NO_CONTENT_FILE',
  SET_BEAUTIFY_FILE: 'SET_BEAUTIFY_FILE',
  SET_FILTER_BY_FILE_TYPE: 'SET_FILTER_BY_FILE_TYPE',
  SET_FILTER_BY_SIZE: 'SET_FILTER_BY_SIZE',
  SET_INCLUDE_IMAGES: 'SET_INCLUDE_IMAGES',
  SET_INCLUDE_STYLESHEETS: 'SET_INCLUDE_STYLESHEETS',
  SET_INCLUDE_SCRIPTS: 'SET_INCLUDE_SCRIPTS',
  SET_INCLUDE_FONTS: 'SET_INCLUDE_FONTS',
  SET_INCLUDE_DOCUMENTS: 'SET_INCLUDE_DOCUMENTS',
  SET_MIN_FILE_SIZE: 'SET_MIN_FILE_SIZE',
  SET_MAX_FILE_SIZE: 'SET_MAX_FILE_SIZE',
  SET_EXCLUDE_DOMAINS: 'SET_EXCLUDE_DOMAINS',
  SET_CUSTOM_FILE_EXTENSIONS: 'SET_CUSTOM_FILE_EXTENSIONS',
};

export const INITIAL_STATE = {
  ignoreNoContentFile: false,
  beautifyFile: false,
  filterByFileType: false,
  filterBySize: false,
  includeImages: true,
  includeStylesheets: true,
  includeScripts: true,
  includeFonts: true,
  includeDocuments: true,
  minFileSize: 0, // in KB
  maxFileSize: 10240, // 10MB in KB
  excludeDomains: [],
  customFileExtensions: [], // custom extensions to include
};

export const setIgnoreNoContentFile = (willIgnore) => ({
  type: ACTIONS.SET_IGNORE_NO_CONTENT_FILE,
  payload: !!willIgnore,
});

export const setBeautifyFile = (willBeautify) => ({
  type: ACTIONS.SET_BEAUTIFY_FILE,
  payload: !!willBeautify,
});

export const setFilterByFileType = (willFilter) => ({
  type: ACTIONS.SET_FILTER_BY_FILE_TYPE,
  payload: !!willFilter,
});

export const setFilterBySize = (willFilter) => ({
  type: ACTIONS.SET_FILTER_BY_SIZE,
  payload: !!willFilter,
});

export const setIncludeImages = (willInclude) => ({
  type: ACTIONS.SET_INCLUDE_IMAGES,
  payload: !!willInclude,
});

export const setIncludeStylesheets = (willInclude) => ({
  type: ACTIONS.SET_INCLUDE_STYLESHEETS,
  payload: !!willInclude,
});

export const setIncludeScripts = (willInclude) => ({
  type: ACTIONS.SET_INCLUDE_SCRIPTS,
  payload: !!willInclude,
});

export const setIncludeFonts = (willInclude) => ({
  type: ACTIONS.SET_INCLUDE_FONTS,
  payload: !!willInclude,
});

export const setIncludeDocuments = (willInclude) => ({
  type: ACTIONS.SET_INCLUDE_DOCUMENTS,
  payload: !!willInclude,
});

export const setMinFileSize = (size) => ({
  type: ACTIONS.SET_MIN_FILE_SIZE,
  payload: Math.max(0, parseInt(size) || 0),
});

export const setMaxFileSize = (size) => ({
  type: ACTIONS.SET_MAX_FILE_SIZE,
  payload: Math.max(0, parseInt(size) || 10240),
});

export const setExcludeDomains = (domains) => ({
  type: ACTIONS.SET_EXCLUDE_DOMAINS,
  payload: Array.isArray(domains) ? domains : [],
});

export const setCustomFileExtensions = (extensions) => ({
  type: ACTIONS.SET_CUSTOM_FILE_EXTENSIONS,
  payload: Array.isArray(extensions) ? extensions : [],
});

export const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_IGNORE_NO_CONTENT_FILE: {
      return {
        ...state,
        ignoreNoContentFile: action.payload,
      };
    }
    case ACTIONS.SET_BEAUTIFY_FILE: {
      return {
        ...state,
        beautifyFile: action.payload,
      };
    }
    case ACTIONS.SET_FILTER_BY_FILE_TYPE: {
      return {
        ...state,
        filterByFileType: action.payload,
      };
    }
    case ACTIONS.SET_FILTER_BY_SIZE: {
      return {
        ...state,
        filterBySize: action.payload,
      };
    }
    case ACTIONS.SET_INCLUDE_IMAGES: {
      return {
        ...state,
        includeImages: action.payload,
      };
    }
    case ACTIONS.SET_INCLUDE_STYLESHEETS: {
      return {
        ...state,
        includeStylesheets: action.payload,
      };
    }
    case ACTIONS.SET_INCLUDE_SCRIPTS: {
      return {
        ...state,
        includeScripts: action.payload,
      };
    }
    case ACTIONS.SET_INCLUDE_FONTS: {
      return {
        ...state,
        includeFonts: action.payload,
      };
    }
    case ACTIONS.SET_INCLUDE_DOCUMENTS: {
      return {
        ...state,
        includeDocuments: action.payload,
      };
    }
    case ACTIONS.SET_MIN_FILE_SIZE: {
      return {
        ...state,
        minFileSize: action.payload,
      };
    }
    case ACTIONS.SET_MAX_FILE_SIZE: {
      return {
        ...state,
        maxFileSize: action.payload,
      };
    }
    case ACTIONS.SET_EXCLUDE_DOMAINS: {
      return {
        ...state,
        excludeDomains: action.payload,
      };
    }
    case ACTIONS.SET_CUSTOM_FILE_EXTENSIONS: {
      return {
        ...state,
        customFileExtensions: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default getReducerConfig(STATE_KEY, uiReducer);
