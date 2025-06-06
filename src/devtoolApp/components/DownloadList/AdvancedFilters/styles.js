import styled from 'styled-components';

export const AdvancedFiltersContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
`;

export const AdvancedFiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.$expanded ? '8px 8px 0 0' : '8px'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
  }
`;

export const AdvancedFiltersTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ExpandIcon = styled.span`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: ${props => props.theme.colors.textSecondary};
`;

export const AdvancedFiltersContent = styled.div`
  padding: ${props => props.$expanded ? '16px' : '0'};
  max-height: ${props => props.$expanded ? '800px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${props => props.$expanded ? `1px solid ${props.theme.colors.border}` : 'none'};
`;

export const FilterSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterSectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ToggleLabel = styled.label`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
`;

export const FileTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

export const FileTypeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.$checked ? props.theme.colors.primary + '20' : props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$checked ? props.theme.colors.primary + '30' : props.theme.colors.backgroundHover};
  }
`;

export const FileTypeIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
`;

export const FileTypeLabel = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.$checked ? '500' : '400'};
`;

export const SizeFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

export const SizeInput = styled.input`
  width: 80px;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const SizeLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  min-height: 32px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.background};
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 11px;
  border-radius: 12px;
`;

export const TagRemove = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const AddTagInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FilterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 4px;
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StatIcon = styled.span`
  font-size: 12px;
`;
