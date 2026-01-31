// src/components/ui/Card.jsx

/**
 * Reusable Card Component
 * Provides consistent card styling across the app
 */

import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}, ref) => {
  
  const classes = [
    'card',
    hover ? 'card-hover' : '',
    onClick ? 'card-clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`card-title ${className}`} {...props}>
      {children}
    </h3>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;

export default Card;