import React from 'react';
import { ButtonWrapper } from './styles';

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  onClick, 
  disabled,
  loading,
  fullWidth,
  color, // legacy support
  ...props 
}) => (
  <ButtonWrapper 
    variant={color || variant} // legacy color prop support
    size={size}
    onClick={onClick} 
    disabled={disabled || loading}
    fullWidth={fullWidth}
    {...props}
  >
    {loading && (
      <span className="spinner" aria-hidden="true" />
    )}
    <span className={loading ? 'loading' : ''}>{children}</span>
  </ButtonWrapper>
);

export default Button;
