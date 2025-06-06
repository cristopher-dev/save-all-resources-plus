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
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
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
  padding: ${({ expanded }) => expanded ? '16px' : '0'};
  max-height: ${({ expanded }) => expanded ? '600px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const ExportSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ExportSectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ExportOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
`;

export const ExportOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border
  };
  border-radius: 8px;
  background: ${({ selected, theme }) => 
    selected ? `${theme.colors.primary}10` : theme.colors.background
  };
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

export const OptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 18px;
`;

export const OptionContent = styled.div`
  flex: 1;
`;

export const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const OptionDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

export const GroupSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const GroupItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border
  };
  border-radius: 6px;
  background: ${({ selected, theme }) => 
    selected ? `${theme.colors.primary}08` : theme.colors.background
  };
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

export const GroupCheckbox = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  svg {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  ${GroupItem}:hover svg,
  input:checked + svg {
    opacity: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.background};
    transition: all 0.2s ease;
  }
  
  input:checked + svg + &::before,
  ${GroupItem}:hover &::before {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

export const GroupLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  
  svg {
    color: ${({ color }) => color};
  }
`;

export const GroupStats = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  div:first-child {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ConfigSection = styled(ExportSection)`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 16px;
`;

export const ConfigRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ConfigLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  min-width: 80px;
`;

export const ConfigSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ConfigCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ExportActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
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
  
  background: ${({ primary, theme }) => 
    primary ? theme.colors.primary : theme.colors.background
  };
  color: ${({ primary, theme }) => 
    primary ? 'white' : theme.colors.text
  };
  border: ${({ primary, theme }) => 
    primary ? 'none' : `1px solid ${theme.colors.border}`
  };

  &:hover:not(:disabled) {
    background: ${({ primary, theme }) => 
      primary ? theme.colors.primaryHover : theme.colors.surfaceHover
    };
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
  margin: 16px 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
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
