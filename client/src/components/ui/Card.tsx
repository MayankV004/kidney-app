import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-elevation-2 overflow-hidden';
  const hoverClasses = hoverEffect 
    ? 'transition-shadow hover:shadow-elevation-3 cursor-pointer' 
    : '';

  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`;

  if (onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
        whileTap={hoverEffect ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cardClasses}>{children}</div>;
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 border-b border-neutral-200 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-4 border-t border-neutral-200 ${className}`}>{children}</div>;
};