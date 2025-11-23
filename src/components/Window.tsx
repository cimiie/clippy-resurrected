'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { WindowProps } from '@/types/WindowTypes';
import styles from './Window.module.css';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

export default function Window({
  id,
  title,
  initialPosition,
  initialSize,
  children,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  isMinimized,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle drag start on title bar
  const handleMouseDownTitle = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return; // Don't drag if clicking buttons
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus();
  };

  // Handle resize start
  const handleMouseDownResize = (e: MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    onFocus();
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
        }
        if (resizeDirection.includes('w')) {
          const potentialWidth = resizeStart.width - deltaX;
          if (potentialWidth >= MIN_WIDTH) {
            newWidth = potentialWidth;
            newX = position.x + deltaX;
          }
        }
        if (resizeDirection.includes('n')) {
          const potentialHeight = resizeStart.height - deltaY;
          if (potentialHeight >= MIN_HEIGHT) {
            newHeight = potentialHeight;
            newY = position.y + deltaY;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, resizeDirection]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      }}
      onMouseDown={onFocus}
      data-window-id={id}
    >
      {/* Title Bar */}
      <div
        className={styles.titleBar}
        onMouseDown={handleMouseDownTitle}
      >
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button
            className={styles.minimizeButton}
            onClick={onMinimize}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Resize Handles */}
      <div
        className={`${styles.resizeHandle} ${styles.resizeN}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'n')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeS}`}
        onMouseDown={(e) => handleMouseDownResize(e, 's')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeE}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'e')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeW}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'w')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeNE}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'ne')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeNW}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'nw')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeSE}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'se')}
      />
      <div
        className={`${styles.resizeHandle} ${styles.resizeSW}`}
        onMouseDown={(e) => handleMouseDownResize(e, 'sw')}
      />
    </div>
  );
}
