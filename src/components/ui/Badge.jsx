// src/components/ui/Badge.jsx

/**
 * Reusable Badge Component
 * Used for status indicators, labels, and tags
 */

import { forwardRef } from 'react';

const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}, ref) => {
  
  const variantClasses = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  const classes = [
    'badge',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.md,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;