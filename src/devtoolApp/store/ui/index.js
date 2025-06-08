import { getReducerConfig } from '../utils';

export const STATE_KEY = `ui`;

export const ACTIONS = {
  SET_IS_SAVING: 'SET_IS_SAVING',
  SET_SAVING_INDEX: 'SET_SAVING_INDEX',
  SET_STATUS: 'SET_STATUS',
  SET_TAB: 'SET_TAB',
  SET_LOG: 'SET_LOG',
  SET_ANALYSIS_COMPLETED: 'SET_ANALYSIS_COMPLETED',
  SET_SELECTED_RESOURCES: 'SET_SELECTED_RESOURCES',
  TOGGLE_RESOURCE_SELECTION: 'TOGGLE_RESOURCE_SELECTION',
  CLEAR_SELECTED_RESOURCES: 'CLEAR_SELECTED_RESOURCES',
  STOP_ANALYSIS: 'STOP_ANALYSIS',
  RESET_ANALYSIS: 'RESET_ANALYSIS',
  START_ANALYSIS: 'START_ANALYSIS',
  FORCE_RESET_SAVING: 'FORCE_RESET_SAVING',
};

export const INITIAL_STATE = {
  tab: null,
  log: null,
  isSaving: false,
  savingIndex: 0,
  status: `Ready to scan...`,
  analysisCompleted: false,
  selectedResources: {},
  isAnalyzing: false,
};

export const setLog = (log) => ({
  type: ACTIONS.SET_LOG,
  payload: log,
});

export const setTab = (tab) => ({
  type: ACTIONS.SET_TAB,
  payload: tab,
});

export const setIsSaving = (isSaving) => ({
  type: ACTIONS.SET_IS_SAVING,
  payload: isSaving,
});

export const setSavingIndex = (savingIndex) => ({
  type: ACTIONS.SET_SAVING_INDEX,
  payload: savingIndex,
});

export const setStatus = (status) => ({
  type: ACTIONS.SET_STATUS,
  payload: status,
});

// Nuevo creador de acción
export const setAnalysisCompleted = () => ({
  type: ACTIONS.SET_ANALYSIS_COMPLETED,
});

export const setSelectedResources = (selectedResources) => ({
  type: ACTIONS.SET_SELECTED_RESOURCES,
  payload: selectedResources,
});

export const toggleResourceSelection = (url) => ({
  type: ACTIONS.TOGGLE_RESOURCE_SELECTION,
  payload: url,
});

export const clearSelectedResources = () => ({
  type: ACTIONS.CLEAR_SELECTED_RESOURCES,
});

export const stopAnalysis = () => ({
  type: ACTIONS.STOP_ANALYSIS,
});

export const resetAnalysis = () => ({
  type: ACTIONS.RESET_ANALYSIS,
});

export const startAnalysis = () => ({
  type: ACTIONS.START_ANALYSIS,
});

export const forceResetSaving = () => ({
  type: ACTIONS.FORCE_RESET_SAVING,
});

let flashStatusTimeoutHandler = null;
export const flashStatus =
  (status, timeout = 1000) =>
  (dispatch, getState) => {
    if (status) {
      clearTimeout(flashStatusTimeoutHandler);
      dispatch(setStatus(status));
      flashStatusTimeoutHandler = setTimeout(() => {
        dispatch(setStatus(INITIAL_STATE.status));
      }, timeout);
    }
  };

export const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_IS_SAVING: {
      return {
        ...state,
        isSaving: action.payload,
      };
    }
    case ACTIONS.SET_SAVING_INDEX: {
      return {
        ...state,
        savingIndex: action.payload,
      };
    }
    case ACTIONS.SET_STATUS: {
      return {
        ...state,
        status: action.payload,
      };
    }
    case ACTIONS.SET_TAB: {
      return {
        ...state,
        tab: action.payload,
      };
    }
    case ACTIONS.SET_LOG: {
      return {
        ...state,
        log: action.payload,
      };
    }
    // Manejar la nueva acción en el reducer
    case ACTIONS.SET_ANALYSIS_COMPLETED: {
      return {
        ...state,
        analysisCompleted: true,
        isAnalyzing: false,
        status: 'Analysis completed',
      };
    }
    case ACTIONS.SET_SELECTED_RESOURCES: {
      return {
        ...state,
        selectedResources: action.payload,
      };
    }
    case ACTIONS.TOGGLE_RESOURCE_SELECTION: {
      return {
        ...state,
        selectedResources: {
          ...state.selectedResources,
          [action.payload]: !state.selectedResources[action.payload],
        },
      };
    }
    case ACTIONS.CLEAR_SELECTED_RESOURCES: {
      return {
        ...state,
        selectedResources: {},
      };
    }
    case ACTIONS.STOP_ANALYSIS: {
      return {
        ...state,
        isAnalyzing: false,
        analysisCompleted: true,
        status: 'Analysis stopped by user',
      };
    }
    case ACTIONS.RESET_ANALYSIS: {
      return {
        ...state,
        isAnalyzing: false,
        analysisCompleted: false,
        selectedResources: {},
        status: 'Restarting analysis...',
      };
    }
    case ACTIONS.START_ANALYSIS: {
      return {
        ...state,
        isAnalyzing: true,
        analysisCompleted: false,
        status: 'Starting resource scan...',
      };
    }
    case ACTIONS.FORCE_RESET_SAVING: {
      return {
        ...state,
        isSaving: false,
        savingIndex: 0,
        status: 'Save operation reset',
      };
    }
    default: {
      return state;
    }
  }
};

export default getReducerConfig(STATE_KEY, uiReducer);
