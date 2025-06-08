import React from 'react';
import { ButtonWrapper } from './styles';

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  onClick, 
  disabled = false,
  loading = false,
  fullWidth = false,
  color, // legacy support
  type = 'button',
  ...restProps 
}) => {
  // Filter out any remaining custom props that shouldn't go to DOM
  const { primary, secondary, ...domProps } = restProps;
  
  // Handle click with proper event propagation
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  };
  
  return (
    <ButtonWrapper 
      type={type}
      variant={color || variant} // legacy color prop support
      size={size}
      onClick={handleClick} 
      disabled={disabled || loading}
      fullWidth={fullWidth}
      {...domProps}
    >
      {loading && (
        <span className="spinner" aria-hidden="true" />
      )}
      <span className={loading ? 'loading' : ''}>{children}</span>
    </ButtonWrapper>
  );
};

export default Button;
