import styled from 'styled-components';

export const PreviewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const PreviewTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

export const CloseButton = styled.button`
  background: ${props => props.theme.colors.danger};
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }
`;

export const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: ${props => props.theme.colors.backgroundAlt};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const TypeFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TypeBadge = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid ${props => props.$active ? props.color || props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.$active ? props.color || props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.color || props.theme.colors.primary};
    color: white;
  }
`;

export const ResourceStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const StatsItem = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const PreviewContent = styled.div`
  flex: 1;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

export const ResourceList = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 16px 24px;
`;

export const ResourceItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ResourceInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const ResourceName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  word-break: break-all;
`;

export const ResourceMeta = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ResourcePreview = styled.div`
  flex: 2;
  max-width: 300px;
  max-height: 200px;
  overflow: hidden;
  border-radius: 6px;
  background: ${props => props.theme.colors.backgroundAlt};
`;

export const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
`;

export const PreviewCode = styled.pre`
  padding: 12px;
  font-size: 10px;
  line-height: 1.4;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

export const NoPreviewMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  font-style: italic;
`;
