'use client';

import { useState } from 'react';
import styles from './ControlPanelApp.module.css';

type PanelView = 'main' | 'display' | 'system' | 'sounds' | 'datetime' | 'programs';

export default function ControlPanelApp() {
  const [view, setView] = useState<PanelView>('main');

  const renderMain = () => (
    <div className={styles.iconGrid}>
      <button className={styles.iconButton} onClick={() => setView('display')}>
        <div className={styles.icon}>🖥️</div>
        <div className={styles.iconLabel}>Display</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('system')}>
        <div className={styles.icon}>💻</div>
        <div className={styles.iconLabel}>System</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('sounds')}>
        <div className={styles.icon}>🔊</div>
        <div className={styles.iconLabel}>Sounds</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('datetime')}>
        <div className={styles.icon}>🕐</div>
        <div className={styles.iconLabel}>Date/Time</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('programs')}>
        <div className={styles.icon}>📦</div>
        <div className={styles.iconLabel}>Add/Remove Programs</div>
      </button>
      <button className={styles.iconButton}>
        <div className={styles.icon}>🖱️</div>
        <div className={styles.iconLabel}>Mouse</div>
      </button>
      <button className={styles.iconButton}>
        <div className={styles.icon}>⌨️</div>
        <div className={styles.iconLabel}>Keyboard</div>
      </button>
      <button className={styles.iconButton}>
        <div className={styles.icon}>🌐</div>
        <div className={styles.iconLabel}>Network</div>
      </button>
    </div>
  );

  const renderDisplay = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Display Properties</h2>
      </div>
      <div className={styles.tabs}>
        <button className={styles.tab}>Background</button>
        <button className={styles.tab}>Screen Saver</button>
        <button className={styles.tab}>Appearance</button>
        <button className={styles.tab}>Settings</button>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.field}>
          <label>Wallpaper:</label>
          <select className={styles.select}>
            <option>(None)</option>
            <option>Clouds</option>
            <option>Setup</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Colors:</label>
          <select className={styles.select}>
            <option>256 Colors</option>
            <option>High Color (16 bit)</option>
            <option>True Color (24 bit)</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Resolution:</label>
          <select className={styles.select}>
            <option>640 x 480</option>
            <option>800 x 600</option>
            <option>1024 x 768</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>System Properties</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.systemInfo}>
          <h3>System:</h3>
          <p>Kiro 97</p>
          <p>Version 1.0.0</p>
          <p>&nbsp;</p>
          <h3>Computer:</h3>
          <p>Intel Pentium(r) Processor</p>
          <p>133 MHz</p>
          <p>64.0 MB RAM</p>
        </div>
      </div>
    </div>
  );

  const renderSounds = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Sounds Properties</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.field}>
          <label>Events:</label>
          <select className={styles.selectList} size={8}>
            <option>Windows Start</option>
            <option>Windows Exit</option>
            <option>Critical Stop</option>
            <option>Exclamation</option>
            <option>Asterisk</option>
            <option>Default Beep</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Sound:</label>
          <input type="text" className={styles.input} value="C:\WINDOWS\MEDIA\CHIMES.WAV" readOnly />
        </div>
      </div>
    </div>
  );

  const renderDateTime = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Date/Time Properties</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.dateTimeGrid}>
          <div className={styles.field}>
            <label>Date:</label>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label>Time:</label>
            <input type="time" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label>Time Zone:</label>
            <select className={styles.select}>
              <option>(GMT-08:00) Pacific Time (US & Canada)</option>
              <option>(GMT-05:00) Eastern Time (US & Canada)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Add/Remove Programs</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.programsList}>
          <div className={styles.programItem}>
            <div className={styles.programName}>Minesweeper</div>
            <button className={styles.button}>Remove</button>
          </div>
          <div className={styles.programItem}>
            <div className={styles.programName}>Paint</div>
            <button className={styles.button}>Remove</button>
          </div>
          <div className={styles.programItem}>
            <div className={styles.programName}>Kiro Code Editor</div>
            <button className={styles.button}>Remove</button>
          </div>
          <div className={styles.programItem}>
            <div className={styles.programName}>Internet Explorer</div>
            <button className={styles.button}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {view === 'main' && renderMain()}
      {view === 'display' && renderDisplay()}
      {view === 'system' && renderSystem()}
      {view === 'sounds' && renderSounds()}
      {view === 'datetime' && renderDateTime()}
      {view === 'programs' && renderPrograms()}
    </div>
  );
}
