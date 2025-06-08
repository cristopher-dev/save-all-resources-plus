import styled from 'styled-components';

export const DependencyAnalysisContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
`;

export const DependencyAnalysisHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  cursor: pointer;
  border-bottom: ${({ expanded, theme }) => expanded ? `1px solid ${theme.colors.border}` : 'none'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const DependencyAnalysisTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DependencyAnalysisContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  padding: ${({ expanded }) => expanded ? '16px' : '0'};
  max-height: ${({ expanded }) => expanded ? '600px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const DependencySection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const DependencySectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DependencyGraph = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 16px;
  min-height: 200px;
  position: relative;
  overflow: auto;
`;

export const DependencyNode = styled.div`
  display: inline-block;
  background: ${({ nodeType, theme }) => {
    switch (nodeType) {
      case 'html': return theme.colors.info;
      case 'css': return theme.colors.warning;
      case 'js': return theme.colors.success;
      case 'image': return theme.colors.primary;
      case 'font': return theme.colors.danger;
      default: return theme.colors.textSecondary;
    }
  }};
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const DependencyConnection = styled.div`
  position: absolute;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
`;

export const DependencyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 12px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DependencyList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

export const DependencyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ depth, theme }) => {
    const alpha = Math.min(depth * 0.1, 0.3);
    return `rgba(${theme.colors.primary.replace('#', '')}, ${alpha})`;
  }};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DependencyItemInfo = styled.div`
  flex: 1;
  margin-right: 12px;
`;

export const DependencyItemName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const DependencyItemType = styled.span`
  display: inline-block;
  background: ${({ itemType, theme }) => {
    switch (itemType) {
      case 'css': return theme.colors.warning;
      case 'js': return theme.colors.success;
      case 'image': return theme.colors.primary;
      case 'font': return theme.colors.danger;
      default: return theme.colors.textSecondary;
    }
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 8px;
`;

export const DependencyItemPath = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: monospace;
`;

export const DependencyActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const CriticalPathContainer = styled.div`
  background: ${({ theme }) => theme.colors.warningBackground};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
`;

export const CriticalPathTitle = styled.h5`
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.warning};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CriticalPathList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CriticalPathItem = styled.div`
  background: ${({ theme }) => theme.colors.warning};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

export const DependencyVisualization = styled.div`
  position: relative;
  height: 250px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  margin-top: 12px;
`;

export const VisualizationSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

export const AnalysisFilters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surfaceHover};
  }
`;
