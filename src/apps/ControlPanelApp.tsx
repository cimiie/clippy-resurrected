'use client';

import { useState } from 'react';
import { useSystemSettings, WallpaperOption, ColorDepth, Resolution, Theme } from '@/contexts/SystemSettingsContext';
import { useInstalledApps, AppId } from '@/contexts/InstalledAppsContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import styles from './ControlPanelApp.module.css';

type PanelView = 'main' | 'display' | 'system' | 'sounds' | 'datetime' | 'programs' | 'mouse';
type DisplayTab = 'background' | 'appearance' | 'settings';

export default function ControlPanelApp() {
  const [view, setView] = useState<PanelView>('main');
  const [displayTab, setDisplayTab] = useState<DisplayTab>('background');
  const [appToRemove, setAppToRemove] = useState<{ id: AppId; name: string } | null>(null);
  const { 
    settings, 
    updateWallpaper, 
    updateColorDepth, 
    updateResolution, 
    updateTheme,
    updateMouseTrail,
    updateMouseTrailLength,
    updateCursorSize
  } = useSystemSettings();
  const { installedApps, uninstallApp } = useInstalledApps();

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
      <button className={styles.iconButton} onClick={() => setView('datetime')}>
        <div className={styles.icon}>🕐</div>
        <div className={styles.iconLabel}>Date/Time</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('programs')}>
        <div className={styles.icon}>📦</div>
        <div className={styles.iconLabel}>Add/Remove Programs</div>
      </button>
      <button className={styles.iconButton} onClick={() => setView('mouse')}>
        <div className={styles.icon}>🖱️</div>
        <div className={styles.iconLabel}>Mouse</div>
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
        <button 
          className={`${styles.tab} ${displayTab === 'background' ? styles.activeTab : ''}`}
          onClick={() => setDisplayTab('background')}
        >
          Background
        </button>
        <button 
          className={`${styles.tab} ${displayTab === 'appearance' ? styles.activeTab : ''}`}
          onClick={() => setDisplayTab('appearance')}
        >
          Appearance
        </button>
        <button 
          className={`${styles.tab} ${displayTab === 'settings' ? styles.activeTab : ''}`}
          onClick={() => setDisplayTab('settings')}
        >
          Settings
        </button>
      </div>
      <div className={styles.panelContent}>
        {displayTab === 'background' && (
          <>
            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>Preview:</div>
              <div className={styles.preview} data-wallpaper={settings.wallpaper}>
                <div className={styles.previewWindow}>
                  <div className={styles.previewTitleBar}></div>
                  <div className={styles.previewContent}></div>
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label>Wallpaper:</label>
              <select 
                className={styles.select}
                value={settings.wallpaper}
                onChange={(e) => updateWallpaper(e.target.value as WallpaperOption)}
              >
                <option value="none">(None)</option>
                <option value="teal">Teal (Classic)</option>
                <option value="clouds">Clouds</option>
                <option value="kiro-logo">Kiro Logo</option>
              </select>
            </div>
          </>
        )}
        {displayTab === 'appearance' && (
          <>
            <div className={styles.field}>
              <label>Theme:</label>
              <div className={styles.themeOptions}>
                <label className={styles.themeOption}>
                  <input
                    type="radio"
                    name="theme"
                    value="retro"
                    checked={settings.theme === 'retro'}
                    onChange={(e) => updateTheme(e.target.value as Theme)}
                  />
                  <div className={styles.themeInfo}>
                    <div className={styles.themeName}>Retro (Classic Windows 98)</div>
                    <div className={styles.themeColors}>
                      <div className={styles.colorSwatch} style={{ background: '#008080' }}></div>
                      <div className={styles.colorSwatch} style={{ background: '#000080' }}></div>
                      <div className={styles.colorSwatch} style={{ background: '#c0c0c0' }}></div>
                    </div>
                  </div>
                </label>
                <label className={styles.themeOption}>
                  <input
                    type="radio"
                    name="theme"
                    value="kiro"
                    checked={settings.theme === 'kiro'}
                    onChange={(e) => updateTheme(e.target.value as Theme)}
                  />
                  <div className={styles.themeInfo}>
                    <div className={styles.themeName}>Kiro (Modern Vibrant)</div>
                    <div className={styles.themeColors}>
                      <div className={styles.colorSwatch} style={{ background: '#FF6B35' }}></div>
                      <div className={styles.colorSwatch} style={{ background: '#F7931E' }}></div>
                      <div className={styles.colorSwatch} style={{ background: '#FDC830' }}></div>
                      <div className={styles.colorSwatch} style={{ background: '#00D9FF' }}></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </>
        )}
        {displayTab === 'settings' && (
          <>
            <div className={styles.field}>
              <label>Colors:</label>
              <select 
                className={styles.select}
                value={settings.colorDepth}
                onChange={(e) => updateColorDepth(e.target.value as ColorDepth)}
              >
                <option value="16">16 Color</option>
                <option value="256">256 Color</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Resolution:</label>
              <select 
                className={styles.select}
                value={settings.resolution}
                onChange={(e) => updateResolution(e.target.value as Resolution)}
              >
                <option value="800x600">800 x 600</option>
                <option value="1024x768">1024 x 768</option>
              </select>
            </div>
          </>
        )}
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={() => setView('main')}>OK</button>
          <button className={styles.button} onClick={() => setView('main')}>Cancel</button>
          <button className={styles.button}>Apply</button>
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

  const renderDateTime = () => {
    // Get current date/time in Melbourne timezone (UTC+10)
    const now = new Date();
    const melbourneTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
    const dateStr = melbourneTime.toISOString().split('T')[0];
    const timeStr = melbourneTime.toTimeString().slice(0, 5);

    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
          <h2>Date/Time Properties</h2>
        </div>
        <div className={styles.panelContent}>
          <div className={styles.dateTimeGrid}>
            <div className={styles.field}>
              <label>Date:</label>
              <input type="date" className={styles.input} defaultValue={dateStr} />
            </div>
            <div className={styles.field}>
              <label>Time:</label>
              <input type="time" className={styles.input} defaultValue={timeStr} />
            </div>
            <div className={styles.field}>
              <label>Time Zone:</label>
              <select className={styles.select} defaultValue="melbourne">
                <option value="melbourne">(GMT+10:00) Melbourne, Sydney</option>
                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                <option>(GMT+00:00) London</option>
                <option>(GMT+01:00) Paris, Berlin</option>
                <option>(GMT+08:00) Singapore, Hong Kong</option>
                <option>(GMT+09:00) Tokyo, Seoul</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPrograms = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Add/Remove Programs</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.programsList}>
          {installedApps.length === 0 ? (
            <div className={styles.emptyMessage}>No programs installed</div>
          ) : (
            installedApps.map(app => (
              <div key={app.id} className={styles.programItem}>
                <div className={styles.programInfo}>
                  <span className={styles.programIcon}>{app.icon}</span>
                  <span className={styles.programName}>{app.name}</span>
                </div>
                <button 
                  className={styles.button}
                  onClick={() => setAppToRemove({ id: app.id, name: app.name })}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {appToRemove && (
        <ConfirmDialog
          title="Confirm File Deletion"
          icon="⚠️"
          message={
            <>
              Are you sure you want to remove <strong>{appToRemove.name}</strong>?
              <br /><br />
              This will remove the program from your system.
            </>
          }
          onConfirm={() => {
            uninstallApp(appToRemove.id);
            setAppToRemove(null);
          }}
          onCancel={() => setAppToRemove(null)}
        />
      )}
    </div>
  );

  const renderMouse = () => (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <button className={styles.backButton} onClick={() => setView('main')}>← Back</button>
        <h2>Mouse Properties</h2>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.mouseSection}>
          <h3>Pointer Options</h3>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={settings.mouseTrail}
                onChange={(e) => updateMouseTrail(e.target.checked)}
              />
              Display pointer trails
            </label>
          </div>
          {settings.mouseTrail && (
            <div className={styles.field}>
              <label>Trail length:</label>
              <div className={styles.sliderContainer}>
                <span>Short</span>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={settings.mouseTrailLength}
                  onChange={(e) => updateMouseTrailLength(Number(e.target.value))}
                  className={styles.slider}
                />
                <span>Long</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.mouseSection}>
          <h3>Cursor Size</h3>
          <div className={styles.field}>
            <label>Size: {settings.cursorSize}%</label>
            <div className={styles.sliderContainer}>
              <span>50%</span>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={settings.cursorSize}
                onChange={(e) => updateCursorSize(Number(e.target.value))}
                className={styles.slider}
              />
              <span>400%</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={() => setView('main')}>OK</button>
          <button className={styles.button} onClick={() => setView('main')}>Cancel</button>
          <button className={styles.button}>Apply</button>
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
      {view === 'mouse' && renderMouse()}
    </div>
  );
}
