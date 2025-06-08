import styled from 'styled-components';

export const PresetsContainer = styled.div`
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
`;

export const PresetsHeader = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const PresetsTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const PresetsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

export const PresetItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const PresetName = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

export const PresetActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PresetButton = styled.button`
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 4px;
  padding: 6px 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.applied {
    background: #10B981;
    animation: pulse 0.3s ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

export const DeletePresetButton = styled(PresetButton)`
  background: ${props => props.theme.colors.danger};
  padding: 4px 6px;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }
`;

export const NewPresetSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 0 0 8px 8px;
`;

export const NewPresetInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SavePresetButton = styled.button`
  background: ${props => props.disabled ? props.theme.colors.textSecondary : props.theme.colors.success};
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.successHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
  }
`;
