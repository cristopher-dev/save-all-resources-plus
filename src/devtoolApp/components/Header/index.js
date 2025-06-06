import React, { useMemo, useState } from 'react';
import { withTheme } from 'styled-components';
import { HeaderWrapper, ButtonGroup } from './styles';
import ResetButton from 'devtoolApp/components/ResetButton';
import Button from 'devtoolApp/components/Button';
import ResourcePreview from 'devtoolApp/components/DownloadList/ResourcePreview';
import { useStore } from 'devtoolApp/store';
import { INITIAL_STATE as UI_INITIAL_STATE } from 'devtoolApp/store/ui';
import { useAppSaveAllResource } from '../../hooks/useAppSaveAllResource';
import { FaEye } from 'react-icons/fa';
import packageJson from '/package.json';

export const Header = (props) => {
  const { state } = useStore();
  const {
    ui: { status, isSaving },
  } = state;
  const { handleOnSave } = useAppSaveAllResource();
  const [showPreview, setShowPreview] = useState(false);

  const saveText = useMemo(() => {
    if (status !== UI_INITIAL_STATE.status) {
      return 'Procesando recursos...';
    }
    return isSaving ? `Guardando recursos en la bóveda...` : `Web Resource Vault`;
  }, [status, isSaving]);

  return (
    <HeaderWrapper>
      <div>
        <span>Web Resource Vault</span>
        <sup>Version: {packageJson?.version || 'LOCAL'}</sup>
        <ResetButton color={props.theme.white} bgColor={props.theme.danger} />
      </div>
      <ButtonGroup>
        <Button 
          onClick={() => setShowPreview(true)} 
          disabled={status !== UI_INITIAL_STATE.status || isSaving}
          color="secondary"
        >
          <FaEye style={{ marginRight: '6px' }} />
          Vista Previa
        </Button>
        <Button onClick={handleOnSave} disabled={status !== UI_INITIAL_STATE.status || isSaving}>
          {saveText}
        </Button>
      </ButtonGroup>
      <ResourcePreview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </HeaderWrapper>
  );
};

export default withTheme(Header);
