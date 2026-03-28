import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Password input with show/hide toggle. Forwards ref and supports standard input props.
 */
const PasswordInput = React.forwardRef(function PasswordInput(
  { className = '', inputClassName = '', id, value, onChange, placeholder, disabled, required, autoComplete, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);
  const inputClasses = [
    inputClassName || className,
    'pr-11 max-sm:pr-14',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="group relative block">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={inputClasses}
        aria-describedby={id ? `${id}-toggle-desc` : undefined}
        {...rest}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xs text-text-tertiary transition-colors duration-200 hover:bg-bg-tertiary hover:text-text-secondary disabled:cursor-default disabled:opacity-50 group-focus-within:text-text-secondary max-sm:h-11 max-sm:w-11 max-sm:rounded-sm"
        onClick={toggle}
        tabIndex={-1}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        id={id ? `${id}-toggle` : undefined}
      >
        {visible ? <FiEyeOff size={18} aria-hidden /> : <FiEye size={18} aria-hidden />}
      </button>
    </div>
  );
});

export default PasswordInput;
