import styled, { css, keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${props => props.theme.colors.primary}40; }
  50% { box-shadow: 0 0 20px ${props => props.theme.colors.primary}80, 0 0 30px ${props => props.theme.colors.primary}40; }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const OptionSectionWrapper = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-xl);
  padding: 24px;
  margin: 0 20px 24px 20px;
  box-shadow: var(--shadow-md);
  transition: var(--transition-default);
  animation: ${fadeInUp} 0.4s ease-out;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary}, 
      ${props => props.theme.colors.secondary},
      ${props => props.theme.colors.primary}
    );
    border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary}05 0%, transparent 70%);
    animation: ${glow} 3s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary}30;
    
    &::before {
      animation: ${shimmer} 2s ease-in-out infinite;
    }
  }
  
  @media (max-width: 768px) {
    margin: 0 16px 20px 16px;
    padding: 20px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary}, 
      ${props => props.theme.colors.secondary}
    );
    border-radius: 1px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: ${props => props.theme.colors.primary};
    transition: var(--transition-default);
  }
  
  &:hover svg {
    transform: rotate(180deg);
  }
`;

export const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const OptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: ${props => props.theme.colors.backgroundAlt};
  border: 2px solid ${props => props.theme.colors.borderLight};
  border-radius: var(--border-radius-lg);
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
  animation: ${slideInFromRight} 0.6s ease-out;
  animation-delay: calc(var(--animation-delay, 0) * 0.1s);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary}15,
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, ${props => props.theme.colors.primary}20 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    border-radius: 50%;
  }
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    border-color: ${props => props.theme.colors.primary}50;
    transform: translateY(-3px) scale(1.02);
    box-shadow: var(--shadow-lg), 0 0 20px ${props => props.theme.colors.primary}15;
    
    &::before {
      left: 100%;
    }
    
    &::after {
      width: 200px;
      height: 200px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const OptionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 16px;
  
  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

export const OptionLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  margin: 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  transition: var(--transition-default);
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 14px;
  }
`;

export const OptionDescription = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  font-weight: 400;
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 20px;
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  /* Special grid for statistics */
  &.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    
    &.stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }
`;

export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.successBackground};
  color: ${props => props.theme.colors.success};
  border: 1px solid ${props => props.theme.colors.successBorder};
  border-radius: var(--border-radius-lg);
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  animation: ${bounceIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  svg {
    color: ${props => props.theme.colors.success};
    font-size: 14px;
    filter: drop-shadow(0 0 3px currentColor);
    
    &.fa-spin {
      animation: spin 1s linear infinite;
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 480px) {
    justify-content: center;
    text-align: center;
  }
`;

// Componentes adicionales para OptionSection
export const AnimatedIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${props => props.theme.colors.primary};
  transition: var(--transition-default);
  animation: ${pulse} 2s ease-in-out infinite;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  &:hover {
    transform: rotate(360deg) scale(1.1);
    animation-play-state: paused;
  }
`;

export const InfoTooltip = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  
  &:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: ${fadeInUp} 0.2s ease-out;
  }
  
  &:hover::after {
    content: '';
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
  }
`;

export const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundAlt};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-md);
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  animation: ${pulse} 1.5s ease-in-out infinite;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border: 2px solid ${props => props.theme.colors.primary};
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const StatsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  background: ${props => props.theme.colors.backgroundAlt};
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: var(--border-radius-lg);
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
  animation: ${bounceIn} 0.6s ease-out;
  min-height: 80px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary}10,
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    border-color: ${props => props.theme.colors.primary}50;
    transform: translateY(-3px) scale(1.02);
    box-shadow: var(--shadow-md);
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    min-height: 70px;
  }
`;

export const StatsNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  line-height: 1;
  margin-bottom: 4px;
  text-shadow: 0 0 10px ${props => props.theme.colors.primary}30;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const StatsLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;


