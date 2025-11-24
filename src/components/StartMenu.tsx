'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import styles from './StartMenu.module.css';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  subItems?: MenuItem[];
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function StartMenu({ isOpen, onClose, menuItems }: StartMenuProps) {
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    // Reset submenu state when closed
    if (openSubMenuId !== null) {
      setOpenSubMenuId(null);
    }
    return null;
  }

  const handleItemClick = (item: MenuItem, e: MouseEvent) => {
    e.stopPropagation();
    
    if (item.action) {
      item.action();
      onClose();
    }
  };

  const handleItemEnter = (itemId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenSubMenuId(itemId);
  };

  const handleItemLeave = () => {
    // Delay closing to allow moving to submenu
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSubMenuId(null);
    }, 200);
  };

  const handleSubMenuEnter = () => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleSubMenuLeave = () => {
    // Close submenu when leaving it
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSubMenuId(null);
    }, 200);
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openSubMenuId === item.id;

    return (
      <div
        key={item.id}
        className={styles.menuItemWrapper}
        onMouseEnter={() => hasSubItems ? handleItemEnter(item.id) : setOpenSubMenuId(null)}
        onMouseLeave={hasSubItems ? handleItemLeave : undefined}
      >
        <div
          className={`${styles.menuItem} ${isOpen ? styles.menuItemActive : ''}`}
          onClick={(e) => handleItemClick(item, e)}
        >
          {item.icon && (
            <span className={styles.menuIcon}>{item.icon}</span>
          )}
          <span className={styles.menuLabel}>{item.label}</span>
          {hasSubItems && (
            <span className={styles.menuArrow}>▶</span>
          )}
        </div>
        {hasSubItems && isOpen && (
          <div 
            className={styles.subMenu}
            onMouseEnter={handleSubMenuEnter}
            onMouseLeave={handleSubMenuLeave}
          >
            {item.subItems!.map((subItem) => (
              <div
                key={subItem.id}
                className={styles.subMenuItem}
                onClick={(e) => handleItemClick(subItem, e)}
              >
                {subItem.icon && (
                  <span className={styles.menuIcon}>{subItem.icon}</span>
                )}
                <span className={styles.menuLabel}>{subItem.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={menuRef} className={styles.startMenu}>
      <div className={styles.menuHeader}>
        <span className={styles.menuHeaderText}>Windows 95</span>
      </div>
      <div className={styles.menuContent}>
        {menuItems.map((item) => renderMenuItem(item))}
      </div>
    </div>
  );
}
