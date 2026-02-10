// src/shared/components/ui/Button.jsx

/**
 * Reusable Button Component
 * Provides consistent button styling across the app
 */

import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    fullWidth ? 'btn-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          {children}
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;