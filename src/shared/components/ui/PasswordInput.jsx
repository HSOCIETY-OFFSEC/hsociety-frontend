import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './PasswordInput.css';

/**
 * Password input with show/hide toggle. Forwards ref and supports standard input props.
 */
const PasswordInput = React.forwardRef(function PasswordInput(
  { className = '', inputClassName = '', id, value, onChange, placeholder, disabled, required, autoComplete, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);

  return (
    <div className="password-input-wrap">
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
        className={inputClassName || className}
        aria-describedby={id ? `${id}-toggle-desc` : undefined}
        {...rest}
      />
      <button
        type="button"
        className="password-input-toggle"
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
