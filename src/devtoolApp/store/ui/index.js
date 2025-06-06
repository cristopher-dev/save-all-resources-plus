import { getReducerConfig } from '../utils';

export const STATE_KEY = `ui`;

export const ACTIONS = {
  SET_IS_SAVING: 'SET_IS_SAVING',
  SET_SAVING_INDEX: 'SET_SAVING_INDEX',
  SET_STATUS: 'SET_STATUS',
  SET_TAB: 'SET_TAB',
  SET_LOG: 'SET_LOG',
  SET_ANALYSIS_COMPLETED: 'SET_ANALYSIS_COMPLETED', // Nueva acción
};

export const INITIAL_STATE = {
  tab: null,
  log: null,
  isSaving: false,
  savingIndex: 0,
  status: `Idle...`,
  analysisCompleted: false, // Nuevo estado inicial
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
        status: 'Análisis completado', // Actualizar también el estado general
      };
    }
    default: {
      return state;
    }
  }
};

export default getReducerConfig(STATE_KEY, uiReducer);
