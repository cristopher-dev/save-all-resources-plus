import { useEffect } from 'react';
import { processNetworkResourceToStore } from '../utils/resource';
import * as networkResourceActions from '../store/networkResource';
import useStore from '../store';
import { initializeNetworkResourceRecording, checkDevtoolsAvailability } from './useAppRecordingNetworkResourceHelpers';

export const useAppRecordingNetworkResource = () => {
  const { dispatch } = useStore();
  useEffect(() => {
    if (!checkDevtoolsAvailability()) {
      const retryTimer = setTimeout(() => {
        if (checkDevtoolsAvailability()) {
          initializeNetworkResourceRecording(dispatch, processNetworkResourceToStore, networkResourceActions);
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    initializeNetworkResourceRecording(dispatch, processNetworkResourceToStore, networkResourceActions);
    return () => {
      dispatch(networkResourceActions.resetNetworkResource());
    };
  }, [dispatch]);
};
