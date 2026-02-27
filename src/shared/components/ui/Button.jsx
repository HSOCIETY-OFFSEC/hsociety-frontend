import '../../../styles/shared/components/ui/Button.css';

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
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    disabled ? 'button--disabled' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-busy={loading || undefined}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <span className="button-spinner" aria-hidden="true" />
      )}

      {/* Button Content */}
      <span className="button-label">
        {children}
      </span>
    </button>
  );
};

export default Button;
