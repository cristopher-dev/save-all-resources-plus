import React, { useState } from 'react';
import { ResetButtonWrapper, ConfirmModal, ModalOverlay, ModalContent } from './styles';
import Button from '../Button';
import { FaRedo, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../../store';
import * as downloadListActions from '../../store/downloadList';
import * as networkResourceActions from '../../store/networkResource';
import * as staticResourceActions from '../../store/staticResource';
import * as uiActions from '../../store/ui';

// Función para reiniciar el estado de la aplicación sin recargar la página
const resetAppState = (dispatch) => {
  console.log('[RESET]: Reiniciando estado de la aplicación sin recargar página');
  
  // Reiniciar todos los stores al estado inicial
  dispatch(networkResourceActions.resetNetworkResource());
  dispatch(staticResourceActions.resetStaticResource());
  dispatch(uiActions.resetAnalysis());
  
  // Reiniciar la lista de descargas
  dispatch(downloadListActions.resetDownloadList());
  
  console.log('[RESET]: Estado de la aplicación reiniciado exitosamente');
};

const ResetButton = ({ variant = 'outline', size = 'sm' }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { dispatch } = useStore();

  const handleShowModal = (event) => {
    event.stopPropagation();
    setShowConfirm(true);
  };

  const handleCloseModal = (event) => {
    event.stopPropagation();
    setShowConfirm(false);
  };

  const handleReset = (event) => {
    event.stopPropagation();
    setShowConfirm(false);
    resetAppState(dispatch);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCloseModal(event);
    }
  };

  return (
    <>
      <ResetButtonWrapper 
        variant={variant}
        size={size}
        onClick={handleShowModal}
        title="Reiniciar aplicación"
      >
        <FaRedo />
        Reiniciar
      </ResetButtonWrapper>

      {showConfirm && (
        <ConfirmModal>
          <ModalOverlay onClick={handleOverlayClick} />
          <ModalContent>
            <div className="modal-header">
              <FaExclamationTriangle size={24} />
              <h3>¿Reiniciar la aplicación?</h3>
              <button 
                className="close-btn"
                onClick={handleCloseModal}
                type="button"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Esto recargará completamente la aplicación y se perderán 
                todos los datos no guardados.
              </p>
            </div>
            
            <div className="modal-footer">
              <Button 
                variant="ghost" 
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleReset}
              >
                <FaRedo />
                Reiniciar
              </Button>
            </div>
          </ModalContent>
        </ConfirmModal>
      )}
    </>
  );
};

export default ResetButton;