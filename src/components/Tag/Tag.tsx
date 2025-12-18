import React, { useMemo, useCallback } from "react";
import styles from "./Tag.module.css";

interface TagProps {
  text: string;
  onClick?: (tag: string) => void;
}

// Generate consistent color based on tag text
const getTagColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate HSL color with fixed saturation and lightness for consistency
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 85%)`;
};

// Generate contrasting text color
const getTextColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 35%)`;
};

export const Tag = React.memo<TagProps>(({ text, onClick }) => {
  // Memoize color calculations
  const backgroundColor = useMemo(() => getTagColor(text), [text]);
  const textColor = useMemo(() => getTextColor(text), [text]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(text);
    }
  }, [onClick, text]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleClick();
      }
    },
    [onClick, handleClick],
  );

  return (
    <span
      className={`${styles.tag} ${onClick ? styles.clickable : ""}`}
      style={{
        backgroundColor,
        color: textColor,
        borderColor: textColor,
      }}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={onClick ? `Filter by ${text} tag` : undefined}
    >
      #{text}
    </span>
  );
});
