import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';
  /** Thickness of the divider line */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Spacing around the divider */
  spacing?: 'small' | 'medium' | 'large';
  /** Custom color for the divider */
  color?: string;
  /** Optional text label in the center */
  label?: string;
  /** Custom className */
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 'thin',
  spacing = 'medium',
  color,
  label,
  className
}) => {
  const dividerClasses = [
    styles.divider,
    styles[orientation],
    styles[`thickness-${thickness}`],
    styles[`spacing-${spacing}`],
    className
  ].filter(Boolean).join(' ');

  const customStyle = color ? { borderColor: color } : {};

  if (label && orientation === 'horizontal') {
    return (
      <div className={dividerClasses} style={customStyle}>
        <span className={styles.label}>{label}</span>
      </div>
    );
  }

  return <div className={dividerClasses} style={customStyle} />;
}; 