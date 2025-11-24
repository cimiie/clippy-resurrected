'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import styles from './Notepad.module.css';

export interface NotepadState {
  content: string;
  filename: string;
  isModified: boolean;
  cursorPosition: { line: number; col: number };
}

interface NotepadAppProps {
  initialContent?: string;
  initialFilename?: string;
  onStateChange?: (state: NotepadState) => void;
}

type DialogType = 'none' | 'about' | 'find' | 'goto' | 'font' | 'save';

export default function NotepadApp({ initialContent = '', initialFilename = 'Untitled', onStateChange }: NotepadAppProps) {
  const { saveFile } = useFileSystem();
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState(initialFilename);
  const [isModified, setIsModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [statusBar, setStatusBar] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogType>('none');
  const [findText, setFindText] = useState('');
  const [saveFilename, setSaveFilename] = useState('');
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ content, filename, isModified, cursorPosition });
    }
  }, [content, filename, isModified, cursorPosition, onStateChange]);

  // Update cursor position
  const updateCursorPosition = useCallback(() => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line, col });
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
    updateCursorPosition();
  };

  const handleNew = () => {
    if (isModified) {
      const confirm = window.confirm('Do you want to save changes?');
      if (confirm) return;
    }
    setContent('');
    setFilename('Untitled');
    setIsModified(false);
    setActiveMenu(null);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target?.result as string);
          setFilename(file.name);
          setIsModified(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setActiveMenu(null);
  };

  const handleSave = () => {
    setSaveFilename(filename.endsWith('.txt') ? filename : `${filename}.txt`);
    setDialog('save');
    setActiveMenu(null);
  };

  const confirmSave = () => {
    if (!saveFilename.trim()) return;
    
    // Save to virtual file system (My Documents)
    saveFile(saveFilename, content);
    
    setFilename(saveFilename);
    setIsModified(false);
    setDialog('none');
    setSaveFilename('');
  };

  const handleUndo = () => {
    document.execCommand('undo');
    setActiveMenu(null);
  };

  const handleCut = () => {
    document.execCommand('cut');
    setActiveMenu(null);
  };

  const handleCopy = () => {
    document.execCommand('copy');
    setActiveMenu(null);
  };

  const handlePaste = () => {
    document.execCommand('paste');
    setActiveMenu(null);
  };

  const handleDelete = () => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      if (start !== end) {
        const newContent = content.substring(0, start) + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    }
    setActiveMenu(null);
  };

  const handleSelectAll = () => {
    textAreaRef.current?.select();
    setActiveMenu(null);
  };

  const handleTimeDate = () => {
    const now = new Date();
    const timeDate = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const newContent = content.substring(0, start) + timeDate + content.substring(start);
      setContent(newContent);
      setIsModified(true);
    }
    setActiveMenu(null);
  };

  const handleFind = () => {
    setDialog('find');
    setActiveMenu(null);
  };

  const handleFindNext = () => {
    if (!findText || !textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const text = textarea.value;
    const start = textarea.selectionEnd;
    const index = text.indexOf(findText, start);
    
    if (index !== -1) {
      textarea.setSelectionRange(index, index + findText.length);
      textarea.focus();
    } else {
      alert('Cannot find "' + findText + '"');
    }
  };

  const handleWordWrap = () => {
    setWordWrap(!wordWrap);
    setActiveMenu(null);
  };

  const handleStatusBar = () => {
    setStatusBar(!statusBar);
    setActiveMenu(null);
  };

  const handleAbout = () => {
    setDialog('about');
    setActiveMenu(null);
  };

  const closeDialog = () => {
    setDialog('none');
    setFindText('');
    setSaveFilename('');
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className={styles.container}>
      <div className={styles.menuBar}>
        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('file')}>
            File
          </button>
          {activeMenu === 'file' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleNew}>
                New <span className={styles.shortcut}>Ctrl+N</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleOpen}>
                Open... <span className={styles.shortcut}>Ctrl+O</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleSave}>
                Save <span className={styles.shortcut}>Ctrl+S</span>
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} onClick={() => window.print()}>
                Print... <span className={styles.shortcut}>Ctrl+P</span>
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('edit')}>
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleUndo}>
                Undo <span className={styles.shortcut}>Ctrl+Z</span>
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} onClick={handleCut}>
                Cut <span className={styles.shortcut}>Ctrl+X</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleCopy}>
                Copy <span className={styles.shortcut}>Ctrl+C</span>
              </button>
              <button className={styles.dropdownItem} onClick={handlePaste}>
                Paste <span className={styles.shortcut}>Ctrl+V</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleDelete}>
                Delete <span className={styles.shortcut}>Del</span>
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} onClick={handleSelectAll}>
                Select All <span className={styles.shortcut}>Ctrl+A</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleTimeDate}>
                Time/Date <span className={styles.shortcut}>F5</span>
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('search')}>
            Search
          </button>
          {activeMenu === 'search' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleFind}>
                Find... <span className={styles.shortcut}>Ctrl+F</span>
              </button>
              <button className={styles.dropdownItem} onClick={handleFindNext} disabled={!findText}>
                Find Next <span className={styles.shortcut}>F3</span>
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('format')}>
            Format
          </button>
          {activeMenu === 'format' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleWordWrap}>
                {wordWrap ? '✓ ' : ''}Word Wrap
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('view')}>
            View
          </button>
          {activeMenu === 'view' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleStatusBar}>
                {statusBar ? '✓ ' : ''}Status Bar
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('help')}>
            Help
          </button>
          {activeMenu === 'help' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleAbout}>
                About Notepad
              </button>
            </div>
          )}
        </div>
      </div>

      <textarea
        ref={textAreaRef}
        className={styles.textArea}
        value={content}
        onChange={handleContentChange}
        onKeyUp={updateCursorPosition}
        onClick={updateCursorPosition}
        style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
        spellCheck={false}
      />

      {statusBar && (
        <div className={styles.statusBar}>
          <div className={styles.statusSection}>
            <div className={styles.statusItem}>
              Ln {cursorPosition.line}, Col {cursorPosition.col}
            </div>
          </div>
          <div className={styles.statusSection}>
            <div className={styles.statusItem}>
              {isModified ? 'Modified' : 'Saved'}
            </div>
          </div>
        </div>
      )}

      {dialog === 'find' && (
        <div className={styles.dialog}>
          <div className={styles.dialogTitle}>Find</div>
          <div className={styles.dialogContent}>
            <label>
              Find what:
              <input
                type="text"
                className={styles.dialogInput}
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                autoFocus
              />
            </label>
          </div>
          <div className={styles.dialogButtons}>
            <button className={styles.dialogButton} onClick={handleFindNext}>
              Find Next
            </button>
            <button className={styles.dialogButton} onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {dialog === 'save' && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <div className={styles.dialogTitle}>Save As</div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogField}>
                <label>Save in:</label>
                <div className={styles.dialogFolder}>📁 My Documents</div>
              </div>
              <div className={styles.dialogField}>
                <label>File name:</label>
                <input
                  type="text"
                  className={styles.dialogInput}
                  value={saveFilename}
                  onChange={(e) => setSaveFilename(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmSave();
                    if (e.key === 'Escape') closeDialog();
                  }}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.dialogButtons}>
              <button className={styles.dialogButton} onClick={confirmSave}>
                Save
              </button>
              <button className={styles.dialogButton} onClick={closeDialog}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {dialog === 'about' && (
        <div className={styles.dialog}>
          <div className={`${styles.dialogContent} ${styles.aboutDialog}`}>
            <div className={styles.aboutIcon}>📝</div>
            <div className={styles.aboutText}>
              <strong>Notepad</strong>
            </div>
            <div className={styles.aboutText}>Version 1.0</div>
            <div className={styles.aboutText}>Windows 95 Edition</div>
            <div className={styles.aboutText} style={{ marginTop: '12px' }}>
              A simple text editor for Windows 95
            </div>
          </div>
          <div className={styles.dialogButtons}>
            <button className={styles.dialogButton} onClick={closeDialog}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
