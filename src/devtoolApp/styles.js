import styled from 'styled-components';

export const ELASTIC_BEZIER = `cubic-bezier(0.1, 0.71, 0.28, 1.14)`;
export const SMOOTH_BEZIER = `cubic-bezier(0.4, 0, 0.2, 1)`;

export const Wrapper = styled.div`
  width: 100%;
  min-width: 480px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  
  // Contenedor con diseño moderno
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  
  // Gradiente sutil de fondo
  background: linear-gradient(
    135deg, 
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  
  // Animación de entrada
  animation: fadeIn 0.5s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  // Media queries para responsividad
  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
    min-width: 320px;
  }
`;

// Contenedor para cards
export const CardContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--border-radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid ${props => props.theme.colors.border};
  transition: var(--transition-default);
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: var(--border-radius-lg);
  }
`;

// Grid responsivo
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Componente de badge/chip
export const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--border-radius-md);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  
  ${props => {
    switch(props.variant) {
      case 'success':
        return `
          background: ${props.theme.colors.successBackground};
          color: ${props.theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warningBackground};
          color: ${props.theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.errorBackground};
          color: ${props.theme.colors.danger};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundAlt};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

// Divider estilizado
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    ${props => props.theme.colors.border},
    transparent
  );
  margin: 16px 0;
`;
