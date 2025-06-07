export const MANAGE_ACTION_NAMES = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  RESET: 'RESET',
};

export const generateManageActions = (actionName, key) => {
  return {
    add: (item) => {
      const action = item && item[key]
        ? {
            type: `${actionName}_${MANAGE_ACTION_NAMES.ADD}`,
            payload: item,
          }
        : {};
      
      if (actionName === 'DOWNLOAD_LIST_ACTION') {
        // console.log('[DOWNLOAD_LIST]: Adding item to downloadList:', item, 'Action:', action);
      }
      
      return action;
    },
    remove: (item) =>
      item && item[key]
        ? {
            type: `${actionName}_${MANAGE_ACTION_NAMES.REMOVE}`,
            payload: {
              [key]: item[key],
            },
          }
        : {},
    replace: (item, index, upsert) => {
      const action = item && index >= 0
        ? {
            type: `${actionName}_${MANAGE_ACTION_NAMES.REPLACE}`,
            payload: {
              index,
              item,
              upsert,
            },
          }
        : {};
      
      if (actionName === 'DOWNLOAD_LIST_ACTION') {
        // console.log('[DOWNLOAD_LIST]: Replacing item in downloadList at index', index, ':', item, 'Action:', action);
      }
      
      return action;
    },
    reset: () => ({
      type: `${actionName}_${MANAGE_ACTION_NAMES.RESET}`,
    }),
  };
};

export const generateManageReducer =
  (actionName, key, initialState = [], options = {}) =>
  (state = initialState, action) => {
    const { type, payload = {} } = action;
    const { payloadMapper, newPayloadMapper, replacePayloadMapper } = options;
    const mappedPayload = payloadMapper ? payloadMapper(payload, state) : payload;
    
    if (actionName === 'DOWNLOAD_LIST_ACTION') {
      // console.log('[DOWNLOAD_LIST_REDUCER]: Processing action:', type, 'State length before:', state.length, 'Payload:', payload);
    }
    
    switch (type) {
      case `${actionName}_${MANAGE_ACTION_NAMES.ADD}`: {
        const index = state.findIndex((item) => item[key] === mappedPayload[key]);
        if (index >= 0) {
          // Replace
          const newState = [
            ...state.slice(0, index),
            { ...(replacePayloadMapper ? replacePayloadMapper(mappedPayload, state) : mappedPayload) },
            ...state.slice(index + 1),
          ];
          if (actionName === 'DOWNLOAD_LIST_ACTION') {
            // console.log('[DOWNLOAD_LIST_REDUCER]: Replaced existing item, new state length:', newState.length);
          }
          return newState;
        } else {
          // Add New
          const newState = [...state, { ...(newPayloadMapper ? newPayloadMapper(mappedPayload, state) : mappedPayload) }];
          if (actionName === 'DOWNLOAD_LIST_ACTION') {
            // console.log('[DOWNLOAD_LIST_REDUCER]: Added new item, new state length:', newState.length);
          }
          return newState;
        }
      }
      case `${actionName}_${MANAGE_ACTION_NAMES.REMOVE}`: {
        const index = state.findIndex((item) => item[key] === mappedPayload[key]);
        if (index >= 0) {
          // Remove
          return [...state.slice(0, index), ...state.slice(index + 1)];
        } else {
          return state;
        }
      }
      case `${actionName}_${MANAGE_ACTION_NAMES.REPLACE}`: {
        const { index, item, upsert } = payload;
        const mappedPayload = payloadMapper ? payloadMapper(item, state) : item;
        
        if (actionName === 'DOWNLOAD_LIST_ACTION') {
          // console.log('[DOWNLOAD_LIST_REDUCER]: Replace action - index:', index, 'item:', item, 'upsert:', upsert, 'current state length:', state.length);
          // console.log('[DOWNLOAD_LIST_REDUCER]: Condition check - state[index]:', state[index], 'key comparison:', state[index] && state[index][key] !== item[key], 'upsert:', upsert);
        }
        
        if ((state[index] && state[index][key] !== item[key]) || upsert) {
          const newState = [
            ...state.slice(0, index),
            { ...(replacePayloadMapper ? replacePayloadMapper(mappedPayload, state) : mappedPayload) },
            ...state.slice(index + 1),
          ];
          if (actionName === 'DOWNLOAD_LIST_ACTION') {
            // console.log('[DOWNLOAD_LIST_REDUCER]: Replaced/upserted item, new state length:', newState.length);
          }
          return newState;
        } else {
          if (actionName === 'DOWNLOAD_LIST_ACTION') {
            // console.log('[DOWNLOAD_LIST_REDUCER]: No change - conditions not met');
          }
          return state;
        }
      }
      case `${actionName}_${MANAGE_ACTION_NAMES.RESET}`: {
        return [];
      }
      default: {
        return state;
      }
    }
  };

export const getReducerConfig = (stateKey, reducer) => ({
  [stateKey]: reducer,
});
