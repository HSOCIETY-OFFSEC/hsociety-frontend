import React from 'react';

/**
 * Button Component
 * Location: src/shared/components/ui/Button.jsx
 * 
 * Features:
 * - Multiple variants (primary, secondary, danger, ghost)
 * - Loading state with spinner
 * - Disabled state
 * - Full width option
 * - 3D effect on hover
 * - Theme-aware styling
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'card'
 * - size: 'small' | 'medium' | 'large'
 * - loading: boolean
 * - disabled: boolean
 * - fullWidth: boolean
 * - onClick: function
 * - type: 'button' | 'submit' | 'reset'
 * - children: React.Node
 * - className: string
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      border: '2px solid var(--primary-color)',
      hoverBackground: 'var(--primary-color-hover)',
      hoverBorder: 'var(--primary-color-hover)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '2px solid var(--border-color)',
      hoverBackground: 'var(--input-bg)',
      hoverBorder: 'var(--primary-color)'
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff',
      border: '2px solid #ef4444',
      hoverBackground: '#dc2626',
      hoverBorder: '#dc2626'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--primary-color)',
      border: '2px solid transparent',
      hoverBackground: 'var(--primary-color-alpha)',
      hoverBorder: 'transparent'
    },
    card: {
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      border: '2px solid var(--border-color)',
      hoverBackground: 'var(--primary-color-alpha)',
      hoverBorder: 'var(--primary-color)'
    }
  };

  // Size styles
  const sizeStyles = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      height: '36px'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      height: '44px'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      height: '52px'
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const variantExtras = {
    card: {
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      fontSize: size === 'small' ? '0.7rem' : currentSize.fontSize,
      borderRadius: '999px'
    }
  };
  const currentExtras = variantExtras[variant] || {};

  const baseStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...currentSize,
    background: currentVariant.background,
    color: currentVariant.color,
    border: currentVariant.border,
    ...currentExtras,
    opacity: disabled || loading ? 0.6 : 1,
    transform: 'translateY(0)',
    boxShadow: disabled || loading 
      ? 'none' 
      : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const activeStyles = isHovered && !disabled && !loading ? {
    background: currentVariant.hoverBackground,
    borderColor: currentVariant.hoverBorder,
    transform: 'translateY(-2px)',
    boxShadow: variant === 'card'
      ? '0 18px 30px -20px rgba(15, 23, 42, 0.45)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  } : {};

  const pressedStyles = isPressed && !disabled && !loading ? {
    transform: 'translateY(0)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
  } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`button button-${variant} button-${size} ${className}`}
      style={{
        ...baseStyles,
        ...activeStyles,
        ...pressedStyles
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div
          className="button-spinner"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      )}

      {/* Button Content */}
      <span style={{ opacity: loading ? 0.7 : 1 }}>
        {children}
      </span>
    </button>
  );
};

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  if (!document.querySelector('style[data-button-animations]')) {
    style.setAttribute('data-button-animations', 'true');
    document.head.appendChild(style);
  }
}

export default Button;
