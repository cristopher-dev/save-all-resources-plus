import React, { useState } from 'react';
import { ResetButtonWrapper, ConfirmModal, ModalOverlay, ModalContent } from './styles';
import Button from '../Button';
import { FaRedo, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../../store';
import * as downloadListActions from '../../store/downloadList';
import * as networkResourceActions from '../../store/networkResource';
import * as staticResourceActions from '../../store/staticResource';
import * as uiActions from '../../store/ui';
import { useAppAnalysis } from '../../hooks/useAppAnalysis';

const ResetButton = ({ variant = 'outline', size = 'sm' }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { dispatch } = useStore();
  const { handleStartAnalysis } = useAppAnalysis();
  // Function to reset the application state without reloading the page
  const resetAppState = () => {
    console.log('[RESET]: Resetting application state without reloading page');
    
    // Reset all stores to initial state
    dispatch(networkResourceActions.resetNetworkResource());
    dispatch(staticResourceActions.resetStaticResource());
    dispatch(uiActions.resetAnalysis());
      // Reset download list
    dispatch(downloadListActions.resetDownloadList());
    
    // Automatically start analysis after reset
    setTimeout(() => {
      handleStartAnalysis();
      console.log('[RESET]: Analysis started automatically after reset');
    }, 100);
    
    console.log('[RESET]: Application state successfully reset');
  };

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
    resetAppState();
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
        onClick={handleShowModal}        title="Restart application"
      >
        <FaRedo />
        Restart
      </ResetButtonWrapper>

      {showConfirm && (
        <ConfirmModal>
          <ModalOverlay onClick={handleOverlayClick} />
          <ModalContent>
            <div className="modal-header">
              <FaExclamationTriangle size={24} />
              <h3>Restart the application?</h3>
              <button 
                className="close-btn"
                onClick={handleCloseModal}
                type="button"
              >
                <FaTimes />
              </button>
            </div>
              <div className="modal-body">              <p>
                This will completely restart the application, clear all data,
                and automatically reactivate the scanner.
              </p>
              <p>
                All unsaved data will be lost, but the scanner will start
                immediately after the restart.
              </p>
            </div>
            
            <div className="modal-footer">
              <Button 
                variant="ghost" 
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>              <Button 
                variant="danger" 
                onClick={handleReset}
              >
                <FaRedo />
                Reiniciar y Escanear
              </Button>
            </div>
          </ModalContent>
        </ConfirmModal>
      )}
    </>
  );
};

export default ResetButton;