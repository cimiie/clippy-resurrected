'use client';

import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.titleBar}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.content}>
          <div className={styles.icon}>⚠️</div>
          <div className={styles.message}>{message}</div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.button} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
