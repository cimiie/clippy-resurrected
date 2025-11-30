'use client';

import { MouseEvent, CSSProperties } from 'react';
import styles from './DesktopIcon.module.css';

export interface DesktopIconProps {
  id: string;
  label: string;
  iconImage: string;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  gridPosition: { row: number; col: number };
  style?: CSSProperties;
}

export default function DesktopIcon({
  id,
  label,
  iconImage,
  isSelected,
  onSelect,
  onDoubleClick,
  gridPosition,
  style,
}: DesktopIconProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <div
      className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        gridRow: gridPosition.row,
        gridColumn: gridPosition.col,
        ...style,
      }}
      data-icon-id={id}
    >
      <div className={styles.iconImage}>
        <span className={styles.iconEmoji}>{iconImage}</span>
      </div>
      <div className={styles.iconLabel}>
        {label}
      </div>
    </div>
  );
}
