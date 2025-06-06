import styled, { css } from 'styled-components';
import Button from '../Button';

export const ResetButtonWrapper = styled(Button)`
  // Hereda todos los estilos del Button base
`;

export const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${props => props.theme.zIndex?.modal || 1040};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  position: relative;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 24px 0;
    
    svg {
      color: ${props => props.theme.colors.warning};
      flex-shrink: 0;
    }
    
    h3 {
      flex: 1;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }
    
    .close-btn {
      background: none;
      border: none;
      color: ${props => props.theme.colors.textSecondary};
      cursor: pointer;
      padding: 4px;
      border-radius: var(--border-radius-sm);
      transition: var(--transition-default);
      
      &:hover {
        background: ${props => props.theme.colors.backgroundHover};
        color: ${props => props.theme.colors.text};
      }
    }
  }
  
  .modal-body {
    padding: 16px 24px 24px;
    
    p {
      margin: 0;
      color: ${props => props.theme.colors.textSecondary};
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 24px 24px;
    border-top: 1px solid ${props => props.theme.colors.border};
    margin-top: 16px;
    padding-top: 16px;
  }
`;