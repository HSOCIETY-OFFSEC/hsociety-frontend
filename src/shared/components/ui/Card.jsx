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

  const isClickable = !!onClick;
  const paddingMap = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const shadowMap = {
    none: 'shadow-none',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  };

  const baseClasses = [
    'relative overflow-hidden rounded-md border border-border bg-card text-text-primary transition-all duration-200 ease-out',
    paddingMap[padding] || paddingMap.medium,
    shadowMap[shadow] || shadowMap.medium,
    isClickable ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand' : '',
    hover3d ? 'transform-gpu' : '',
    isClickable && !hover3d ? 'hover:-translate-y-0.5 hover:shadow-lg hover:border-brand/40' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const transformStyle =
    isHovered && hover3d
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 5}deg) rotateY(${(mousePosition.x - 0.5) * -5}deg) translateY(-4px)`
      : undefined;

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
      className={baseClasses}
      style={{
        ...style,
        transform: transformStyle
      }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      }}
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
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(var(--brand-rgb), 0.12) 0%, transparent 50%)`,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 1 : 0
          }}
        />
      )}

      {/* Card Content - flex column + gap so content is well spaced in all dashboards */}
      <div className="relative z-10 flex min-w-0 flex-col gap-5">
        {children}
      </div>
    </div>
  );
};

export default Card;
