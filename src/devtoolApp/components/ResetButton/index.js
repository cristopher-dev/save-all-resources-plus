import React, { useState } from 'react';
import { ResetButtonWrapper, ConfirmModal, ModalOverlay, ModalContent } from './styles';
import Button from '../Button';
import { FaRedo, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const reloadWindow = () => window.location.reload(true);

const ResetButton = ({ variant = 'outline', size = 'sm' }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    setShowConfirm(false);
    reloadWindow();
  };

  return (
    <>
      <ResetButtonWrapper 
        variant={variant}
        size={size}
        onClick={() => setShowConfirm(true)}
        title="Reiniciar aplicación"
      >
        <FaRedo />
        Reiniciar
      </ResetButtonWrapper>

      {showConfirm && (
        <ConfirmModal>
          <ModalOverlay onClick={() => setShowConfirm(false)} />
          <ModalContent>
            <div className="modal-header">
              <FaExclamationTriangle size={24} />
              <h3>¿Reiniciar la aplicación?</h3>
              <button 
                className="close-btn"
                onClick={() => setShowConfirm(false)}
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
                onClick={() => setShowConfirm(false)}
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