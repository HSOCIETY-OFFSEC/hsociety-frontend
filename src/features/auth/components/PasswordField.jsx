import React from 'react';
import PasswordInput from '../../../shared/components/ui/PasswordInput';

const PasswordField = React.forwardRef(function PasswordField(
  { className = '', inputClassName = '', id, value, onChange, placeholder, disabled, required, autoComplete, ...rest },
  ref
) {
  return (
    <PasswordInput
      ref={ref}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      className={className}
      inputClassName={inputClassName}
      {...rest}
    />
  );
});

export default PasswordField;
