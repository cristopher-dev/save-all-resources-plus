import { useEffect } from 'react';
import { processStaticResourceToStore } from '../utils/resource';
import * as staticResourceActions from '../store/staticResource';
import useStore from '../store';
import { initializeStaticResourceRecording, checkDevtoolsAvailability } from './useAppRecordingStaticResourceHelpers';

export const useAppRecordingStaticResource = () => {
  const { dispatch } = useStore();
  useEffect(() => {
    if (!checkDevtoolsAvailability()) {
      const retryTimer = setTimeout(() => {
        if (checkDevtoolsAvailability()) {
          initializeStaticResourceRecording(dispatch, processStaticResourceToStore, staticResourceActions);
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    initializeStaticResourceRecording(dispatch, processStaticResourceToStore, staticResourceActions);
    return () => {
      dispatch(staticResourceActions.resetStaticResource());
    };
  }, [dispatch]);
};
