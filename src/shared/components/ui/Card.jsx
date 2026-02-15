import React, { useState } from 'react';

/**
 * Card Component
 * Location: src/shared/components/ui/Card.jsx
 * 
 * Features:
 * - Clean, minimal design
 * - 3D hover effects (optional)
 * - Theme-aware styling
 * - Clickable variant
 * - Customizable padding
 * - Shadow variations
 * 
 * Props:
 * - children: React.Node
 * - className: string
 * - onClick: function (makes card clickable)
 * - hover3d: boolean (enables 3D hover effect)
 * - padding: 'none' | 'small' | 'medium' | 'large'
 * - shadow: 'none' | 'small' | 'medium' | 'large'
 * - style: object (additional inline styles)
 */

const Card = ({
  children,
  className = '',
  onClick = null,
  hover3d = false,
  padding = 'medium',
  shadow = 'medium',
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Padding configurations
  const paddingMap = {
    none: '0',
    small: '1rem',
    medium: '1.5rem',
    large: '2rem'
  };

  // Shadow configurations
  const shadowMap = {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  // Dark theme shadow adjustments
  const darkShadowMap = {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
  };

  const isClickable = !!onClick;
  const isDarkTheme = ['dark', 'black'].includes(document.documentElement.getAttribute('data-theme'));

  // Base card styles
  const baseStyles = {
    position: 'relative',
    background: 'var(--card-bg)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-color)',
    borderRadius: '12px',
    padding: paddingMap[padding],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: isClickable ? 'pointer' : 'default',
    overflow: 'hidden',
    ...style
  };

  // Hover styles
  const hoverStyles = isHovered && (hover3d || isClickable) ? {
    transform: hover3d 
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 5}deg) rotateY(${(mousePosition.x - 0.5) * -5}deg) translateY(-4px)`
      : 'translateY(-2px)',
    boxShadow: isDarkTheme ? darkShadowMap.large : shadowMap.large,
    borderColor: 'var(--primary-color-alpha)'
  } : {
    boxShadow: isDarkTheme ? darkShadowMap[shadow] : shadowMap[shadow]
  };

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (!hover3d) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  return (
    <div
      className={`card ${hover3d ? 'card-3d' : ''} ${isClickable ? 'card-clickable' : ''} ${className}`}
      style={{
        ...baseStyles,
        ...hoverStyles
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* 3D Shine Effect Overlay */}
      {hover3d && isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 1 : 0
          }}
        />
      )}

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
