import styled, { css, keyframes } from 'styled-components';
import { rgba } from 'polished';
import { ButtonWrapper } from '../Button/styles';
import { ImSpinner10 } from 'react-icons/im';
import React from 'react';

// Animations
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

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

const checkPulse = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const DownloadListWrapper = styled.div`
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const DownloadListHeader = styled.div`
  font-size: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.white || '#ffffff'};
  animation: ${slideInRight} 0.8s ease-out;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    padding: 16px;
    font-size: 14px;
    
    h3 {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    
    h3 {
      font-size: 14px;
    }
  }
`;

export const DownloadListContainer = styled.div`
  color: ${(props) => props.theme.colors?.text || props.theme.text || '#ffffff'};
  margin: 0 20px;
  padding: 16px 0;
  max-height: 60vh;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #1283c3, #10b981);
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #60a5fa, #34d399);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    margin: 0 16px;
    padding: 12px 0;
    max-height: 50vh;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
  }

  @media (max-width: 480px) {
    margin: 0 12px;
    padding: 8px 0;
    max-height: 45vh;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
  }

  /* Accessibility - improved for keyboard navigation */
  &:focus-within {
    outline: 2px solid #10b981;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const DownloadListItemWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['highlighted', 'done', 'logExpanded', 'expired'].includes(prop)
})`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 16px 20px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${(props) => props.theme.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  /* Accessibility */
  cursor: pointer;
  role: listitem;
  tabindex: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
  
  /* Focus for accessibility */
  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
  }
  
  &:not(:last-child) {
    border-bottom: 1px dotted ${(props) => (props.logExpanded ? `transparent` : 'rgba(255, 255, 255, 0.1)')};
  }

  /* Responsive design */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 16px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    border-radius: 8px;
    
    &:hover {
      transform: none; /* Disable hover effects on touch devices */
    }
  }

  /* Reduce animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.2s ease, border-color 0.2s ease;
    
    &:hover {
      transform: none;
    }
  }

  ${(props) =>
    props.highlighted
      ? css`
          background: linear-gradient(135deg, rgba(18, 131, 195, 0.3), rgba(96, 165, 250, 0.2));
          border-color: rgba(96, 165, 250, 0.5);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
          font-weight: 600;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #60a5fa, #1283c3);
            border-radius: 0 4px 4px 0;
          }
        `
      : ``};

  ${(props) =>
    props.done
      ? css`
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2));
          border-color: rgba(52, 211, 153, 0.5);
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
          font-weight: 600;
          position: relative;
          
          &::before {
            content: '✓';
            position: absolute;
            left: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          }
        `
      : ``};

  ${ButtonWrapper} {
    padding: 8px 16px;
    font-size: 11px;
    margin-left: 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const DownloadListButtonGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  
  /* Responsive design */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const DownloadListItemUrl = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  overflow-wrap: anywhere;
  padding-right: 20px;
  line-height: 22px;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: ${(props) => props.theme.colors?.text || '#ffffff'};
  position: relative;
  flex: 1;
  transition: all 0.3s ease;
  
  /* Responsive design */
  @media (max-width: 768px) {
    padding-right: 0;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    line-height: 18px;
  }
  
  ${(props) =>
    props.active
      ? css`
          padding-left: 16px;
          color: #60a5fa;
          font-weight: 600;
          
          &::before {
            content: '▶';
            display: block;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            color: #10b981;
            font-size: 12px;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* Responsive for active element */
          @media (max-width: 768px) {
            padding-left: 12px;
          }
        `
      : css`
          &:hover {
            color: #34d399;
          }
        `};
`;

export const AddButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 20px;
  ${ButtonWrapper} {
    font-size: 12px;
    margin-right: 10px;
    padding: 10px 20px;
  }
`;

const SpinningAnimation = keyframes`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
`;

export const Spinner = styled(({ className }) => {
  return (
    <div className={className}>
      <ImSpinner10 size={20} />
    </div>
  );
})`
  animation: ${SpinningAnimation} 1s linear infinite;
  padding: 4px;
  transform-origin: center center;
  color: #fbbf24;
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.4));
`;

// Enhanced custom checkbox
export const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  margin-right: 12px;
  
  /* Accessibility - associated label */
  &:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.1);
  }
  
  &:checked {
    background: linear-gradient(135deg, #10b981, #34d399);
    border-color: #10b981;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
  }
  
  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    
    &:checked::after {
      font-size: 10px;
    }
  }

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    
    &:checked::after {
      font-size: 9px;
    }
  }

  /* Improvements for touch devices */
  @media (pointer: coarse) {
    width: 20px;
    height: 20px;
    
    &:hover {
      transform: none; /* Disable hover scale on touch devices */
    }
  }

  /* Reduce animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.2s ease, border-color 0.2s ease;
    
    &:hover {
      transform: none;
    }
  }
`;

// Improve buttons with visual effects
export const EnhancedButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// File type indicator
export const FileTypeIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: ${props => {
    const url = props.url || '';
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return '#ef4444';
    if (url.match(/\.(css)$/i)) return '#10b981';
    if (url.match(/\.(js|ts)$/i)) return '#f59e0b';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return '#8b5cf6';
    if (url.match(/\.(html|htm)$/i)) return '#3b82f6';
    return '#6b7280';
  }};
  
  /* Responsive design */
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    margin-right: 6px;
    font-size: 10px;
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    margin-right: 4px;
    font-size: 9px;
  }
  
  &::after {
    content: '${props => {
      const url = props.url || '';
      if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return '🖼️';
      if (url.match(/\.(css)$/i)) return '🎨';
      if (url.match(/\.(js|ts)$/i)) return '⚡';
      if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return '🔤';
      if (url.match(/\.(html|htm)$/i)) return '📄';
      return '📁';
    }}';
  }
`;

// Improved tooltip
export const Tooltip = styled.div`
  position: relative;
  
  &:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
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
  }
  
  &:hover::after {
    content: '';
    position: absolute;
    bottom: 90%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
  }
`;

// Circular progress component for stats
export const CircularProgress = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #10b981;
    transform: rotate(${props => (props.percentage || 0) * 3.6}deg);
    transition: transform 0.8s ease;
  }
`;

// Improved status badge
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch(props.status) {
      case 'completed':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'downloading':
        return `
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
          animation: ${pulse} 2s infinite;
        `;
      case 'pending':
        return `
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
    }
  }}
`;

// Ripple effect for interactive elements
export const RippleEffect = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }
  
  &:active::before {
    width: 200px;
    height: 200px;
  }
`;

// Skeleton loader for loading state
export const SkeletonLoader = styled.div`
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 25%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
`;

// Improve accessibility with visible focus
export const AccessibleButton = styled.button`
  position: relative;
  
  &:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }
  
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

// Floating notification
export const FloatingNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10000;
  animation: ${slideInRight} 0.5s ease-out;
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
`;
