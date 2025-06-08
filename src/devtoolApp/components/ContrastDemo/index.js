import React from 'react';
import styled from 'styled-components';
import { useContrastColor } from '../../hooks/useContrastColor';

const DemoContainer = styled.div`
  padding: 20px;
  margin: 16px 0;
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
`;

const DemoSection = styled.div`
  margin-bottom: 16px;
  
  h4 {
    margin: 0 0 8px 0;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
  }
`;

const ColorDemo = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ColorBox = styled.div`
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

/**
 * Componente de demostración para mostrar el contraste automático de colores
 * Este componente muestra cómo el texto se ajusta automáticamente según el fondo
 */
const ContrastDemo = () => {
  const { getStyles, colors } = useContrastColor();
  
  const demoColors = [
    { name: 'Primario', color: '#1283c3' },
    { name: 'Secundario', color: '#10b981' },
    { name: 'Éxito', color: '#4ade80' },
    { name: 'Advertencia', color: '#f59e0b' },
    { name: 'Error', color: '#ef4444' },
    { name: 'Oscuro', color: '#1f2937' },
    { name: 'Claro', color: '#f3f4f6' },
    { name: 'Violeta', color: '#8b5cf6' },
    { name: 'Rosa', color: '#ec4899' },
    { name: 'Cyan', color: '#06b6d4' }
  ];
  
  return (
    <DemoContainer>
      <DemoSection>
        <h4>🎨 Demostración de Contraste Automático</h4>
        <p style={{ 
          fontSize: '12px', 
          color: colors.textSecondary,
          margin: '0 0 12px 0',
          lineHeight: 1.4
        }}>
          El texto se ajusta automáticamente para mantener la legibilidad según el color de fondo.
          En fondos oscuros usa texto blanco, en fondos claros usa texto oscuro.
        </p>
        
        <ColorDemo>
          {demoColors.map(({ name, color }) => (
            <ColorBox key={name} style={getStyles(color)}>
              {name}
              <br />
              <small style={{ opacity: 0.8 }}>{color}</small>
            </ColorBox>
          ))}
        </ColorDemo>
      </DemoSection>
      
      <DemoSection>
        <h4>🌓 Colores del Tema Actual</h4>
        <ColorDemo>
          <ColorBox style={{ background: colors.text, color: colors.white }}>
            Texto Principal
          </ColorBox>
          <ColorBox style={{ background: colors.textSecondary, color: colors.white }}>
            Texto Secundario
          </ColorBox>
          <ColorBox style={getStyles(colors.textOnPrimary)} 
                    data-bg="primary">
            En Primario
          </ColorBox>
          <ColorBox style={getStyles(colors.textOnSuccess)} 
                    data-bg="success">
            En Éxito
          </ColorBox>
          <ColorBox style={getStyles(colors.textOnWarning)} 
                    data-bg="warning">
            En Advertencia
          </ColorBox>
          <ColorBox style={getStyles(colors.textOnError)} 
                    data-bg="error">
            En Error
          </ColorBox>
        </ColorDemo>
      </DemoSection>
    </DemoContainer>
  );
};

export default ContrastDemo;
