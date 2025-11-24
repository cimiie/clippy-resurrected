# UI Patterns & Styling Guidelines

## Window Management

Applications in this Windows 95 emulator are managed by a window manager system. Apps should NOT include their own window chrome (title bar, close button, etc.).

### App Component Pattern

Apps should return a plain container div that fills the available space:

```typescript
export default function MyApp() {
  return (
    <div className={styles.container}>
      {/* App content */}
    </div>
  );
}
```

**DO NOT:**
- Use React95's `Window`, `WindowHeader`, or `WindowContent` components
- Include close buttons or window controls
- Handle window dragging/resizing

**The window manager handles:**
- Window chrome (title bar, borders, buttons)
- Dragging and resizing
- Z-index management
- Minimize/maximize/close functionality

## Menu Bar Pattern

Use CSS modules for consistent Windows 95 menu styling. Follow the pattern established in Notepad and Paint apps.

### Menu Bar Structure

```typescript
import styles from './MyApp.module.css';

const [showMenu, setShowMenu] = useState<string | null>(null);

const toggleMenu = (menu: string) => {
  setShowMenu(showMenu === menu ? null : menu);
};

return (
  <div className={styles.menuBar}>
    <div className={styles.menuItem}>
      <button className={styles.menuButton} onClick={() => toggleMenu('file')}>
        File
      </button>
      {showMenu === 'file' && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={handleAction}>
            Action
          </button>
          <div className={styles.dropdownSeparator} />
          <button className={styles.dropdownItem} disabled>
            Disabled Action
          </button>
        </div>
      )}
    </div>
  </div>
);
```

### Required CSS Module Classes

```css
.menuBar {
  display: flex;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 0;
  position: relative;
  z-index: 100;
}

.menuItem {
  position: relative;
  display: inline-block;
}

.menuButton {
  padding: 4px 8px;
  background: transparent;
  border: none;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.menuButton:hover {
  background: #000080;
  color: white;
}

.dropdown {
  position: absolute;
  top: calc(100% - 2px);
  left: 0;
  background: #c0c0c0;
  border: 2px outset #ffffff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
  min-width: 150px;
  z-index: 1000;
}

.dropdownItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px 4px 8px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.dropdownItem:hover:not(:disabled) {
  background: #000080;
  color: white;
}

.dropdownItem:disabled {
  color: #808080;
  cursor: default;
}

.dropdownSeparator {
  height: 1px;
  background: #808080;
  margin: 2px 0;
}
```

## Windows 95 Styling Standards

### Colors

- Background: `#c0c0c0` (classic gray)
- Active selection: `#000080` (navy blue)
- Text: `#000000` (black)
- Disabled text: `#808080` (gray)
- White: `#FFFFFF`

### Borders

- Outset (raised): `border: 2px outset #ffffff`
- Inset (sunken): `border: 2px inset #ffffff` or `border: 1px inset #808080`
- Flat: `border: 1px solid #808080`

### Fonts

- UI Font: `font-family: 'MS Sans Serif', Arial, sans-serif`
- Monospace: `font-family: 'Fixedsys', 'Courier New', monospace`
- Standard size: `font-size: 11px`

### Buttons

```css
.button {
  padding: 4px 16px;
  border: 2px outset #ffffff;
  background: #c0c0c0;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.button:active {
  border: 2px inset #ffffff;
}

.button:disabled {
  color: #808080;
}
```

### Status Bars

```css
.statusBar {
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  padding: 2px 4px;
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.statusItem {
  border: 1px inset #808080;
  padding: 1px 4px;
}
```

## CSS Modules

All apps should use CSS modules (`.module.css` files) for styling:

- Co-locate CSS with component: `MyApp.tsx` → `MyApp.module.css`
- Import as: `import styles from './MyApp.module.css'`
- Use className: `<div className={styles.container}>`

## No External UI Libraries

**DO NOT use:**
- React95 (removed from project)
- Material-UI
- Bootstrap
- Any other UI component libraries

**Use native HTML elements styled with CSS modules** to maintain authentic Windows 95 look and feel.

## Reference Implementations

- **Notepad** (`src/apps/NotepadApp.tsx` + `Notepad.module.css`) - Menu bar pattern
- **Paint** (`src/apps/Paint.tsx` + `Paint.module.css`) - Complex layout with toolbars
- **Minesweeper** (`src/apps/MinesweeperApp.tsx` + `MinesweeperApp.module.css`) - Game UI

Copy patterns from these apps when creating new applications.
