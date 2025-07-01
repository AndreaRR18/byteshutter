import React from "react";
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

export const Tag: React.FC<TagProps> = ({ text, onClick }) => {
  const backgroundColor = getTagColor(text);
  const textColor = getTextColor(text);

  const handleClick = () => {
    if (onClick) {
      onClick(text);
    }
  };

  return (
    <span
      className={`${styles.tag} ${onClick ? styles.clickable : ""}`}
      style={{
        backgroundColor,
        color: textColor,
        borderColor: textColor,
      }}
      onClick={handleClick}
    >
      #{text}
    </span>
  );
};
