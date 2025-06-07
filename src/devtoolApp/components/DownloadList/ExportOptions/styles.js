import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const ExportContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
`;

export const ExportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ExportTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ExportContent = styled.div`
  padding: 16px;
`;

export const ExportActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  
  background: ${({ primary, theme }) => 
    primary ? theme.colors.primary : theme.colors.background
  };
  color: ${({ primary }) => 
    primary ? 'white' : 'inherit'
  };

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const ProgressContainer = styled.div`
  margin: 0 0 16px;
`;

export const ProgressText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;
