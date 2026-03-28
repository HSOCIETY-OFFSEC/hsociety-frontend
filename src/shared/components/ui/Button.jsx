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
  const base =
    'inline-flex items-center justify-center gap-2 rounded-sm border-2 font-semibold transition-all duration-200 ease-out shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';

  const variants = {
    primary:
      'bg-brand text-ink-white border-brand hover:bg-brand-hover hover:border-brand-hover',
    secondary:
      'bg-transparent text-text-primary border-border hover:bg-bg-tertiary hover:border-brand',
    danger:
      'bg-status-danger text-ink-white border-status-danger hover:bg-status-danger-dark hover:border-status-danger-dark',
    ghost:
      'bg-transparent text-brand border-transparent hover:bg-brand-alpha',
    card:
      'bg-bg-tertiary text-text-primary border-border hover:bg-brand-alpha hover:border-brand uppercase tracking-widest rounded-full',
  };

  const sizes = {
    small: 'h-9 px-4 text-sm',
    medium: 'h-11 px-6 text-base',
    large: 'h-12 px-8 text-lg',
  };

  const classes = [
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.medium,
    fullWidth ? 'w-full' : '',
    loading ? 'opacity-80' : '',
    className,
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
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {/* Button Content */}
      <span className="opacity-100">{children}</span>
    </button>
  );
};

export default Button;
