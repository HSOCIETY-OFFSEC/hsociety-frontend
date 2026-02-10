// src/shared/components/ui/Input.jsx

/**
 * Reusable Input Component
 * Provides consistent input styling and validation
 */

import { forwardRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Input = forwardRef(({
  label,
  icon,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className = '',
  wrapperClassName = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = type === 'password' && showPasswordToggle;
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'form-group',
    wrapperClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="form-label">
          {icon && <span className="label-icon">{icon}</span>}
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div className={`input-wrapper ${isPasswordField ? 'password-input' : ''}`}>
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPasswordField && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <span className="input-error-message">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;