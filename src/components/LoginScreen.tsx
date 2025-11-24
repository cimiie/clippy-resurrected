'use client';

import { useState } from 'react';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept any credentials for demo purposes
    onLogin();
  };

  return (
    <div className={styles.loginScreen}>
      <div className={styles.background}>
        <div className={styles.clouds}></div>
      </div>
      
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.kiroLogo}>
            <div className={styles.pane} style={{ background: '#FF6B35' }}></div>
            <div className={styles.pane} style={{ background: '#F7931E' }}></div>
            <div className={styles.pane} style={{ background: '#FDC830' }}></div>
            <div className={styles.pane} style={{ background: '#00D9FF' }}></div>
          </div>
          <div className={styles.welcomeText}>
            Welcome to Kiro 97
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.instruction}>
            Type a user name and password to log on to Kiro.
          </div>

          <div className={styles.field}>
            <label htmlFor="username">User name:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.button}>
              OK
            </button>
            <button type="button" className={styles.button}>
              Cancel
            </button>
            <button type="button" className={styles.button}>
              Shut Down...
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Press Ctrl+Alt+Delete to log on
        </div>
      </div>
    </div>
  );
}
