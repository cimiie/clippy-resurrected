'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import styles from './CommandPromptApp.module.css';

interface CommandHistory {
  command: string;
  output: string[];
}

export default function CommandPromptApp() {
  const { listFiles, getFile, deleteFile } = useFileSystem();
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: '', output: ['Kiro 97', '   (C)Copyright Kiro Corp 1997.', ''] }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\WINDOWS');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
      setHistory([...history, { command: '', output: [] }]);
      return;
    }

    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string[] = [];

    switch (command) {
      case 'dir':
        output = handleDir(args);
        break;
      case 'cd':
        output = handleCd(args);
        break;
      case 'cls':
        setHistory([{ command: '', output: [] }]);
        setCurrentCommand('');
        return;
      case 'type':
        output = handleType(args);
        break;
      case 'del':
      case 'delete':
        output = handleDel(args);
        break;
      case 'help':
        output = handleHelp();
        break;
      case 'ver':
        output = ['Kiro 97 [Version 1.0.0]'];
        break;
      case 'date':
        output = [`Current date is: ${new Date().toLocaleDateString()}`];
        break;
      case 'time':
        output = [`Current time is: ${new Date().toLocaleTimeString()}`];
        break;
      case 'echo':
        output = [args.join(' ')];
        break;
      case 'exit':
        output = ['Type EXIT to quit the command prompt.'];
        break;
      default:
        output = [`Bad command or file name: ${command}`];
    }

    setHistory([...history, { command: trimmedCmd, output }]);
    setCommandHistory([...commandHistory, trimmedCmd]);
    setHistoryIndex(-1);
    setCurrentCommand('');
  };

  const handleDir = (args: string[]): string[] => {
    const path = args[0] || currentPath;
    
    if (path.toUpperCase().includes('MY DOCUMENTS') || path === 'C:\\MY DOCUMENTS') {
      const files = listFiles('C:\\My Documents');
      const output = [
        ` Volume in drive C is WINDOWS95`,
        ` Directory of C:\\MY DOCUMENTS`,
        '',
      ];
      
      files.forEach(file => {
        const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const size = file.content.length.toString().padStart(10);
        output.push(`${date}  ${time}    ${size} ${file.name}`);
      });
      
      output.push('', `        ${files.length} File(s)`, '        0 Dir(s)');
      return output;
    }

    if (path.toUpperCase() === 'C:\\WINDOWS\\SYSTEM32' || path.toUpperCase() === 'C:\\WINDOWS\\SYSTEM') {
      return [
        ` Volume in drive C is WINDOWS95`,
        ` Directory of ${path.toUpperCase()}`,
        '',
        '12/31/95  11:59 PM    <DIR>          .',
        '12/31/95  11:59 PM    <DIR>          ..',
        '12/31/95  11:59 PM        50,688 CMD.EXE',
        '12/31/95  11:59 PM        68,096 REGEDIT.EXE',
        '12/31/95  11:59 PM        24,064 CALC.EXE',
        '12/31/95  11:59 PM        32,768 NOTEPAD.EXE',
        '12/31/95  11:59 PM        45,056 MSPAINT.EXE',
        '',
        '        5 File(s)     220,672 bytes',
        '        2 Dir(s)'
      ];
    }

    return [
      ` Volume in drive C is WINDOWS95`,
      ` Directory of ${currentPath}`,
      '',
      '12/31/95  11:59 PM    <DIR>          .',
      '12/31/95  11:59 PM    <DIR>          ..',
      '12/31/95  11:59 PM    <DIR>          SYSTEM',
      '12/31/95  11:59 PM    <DIR>          SYSTEM32',
      '',
      '        0 File(s)              0 bytes',
      '        4 Dir(s)'
    ];
  };

  const handleCd = (args: string[]): string[] => {
    if (args.length === 0) {
      return [currentPath];
    }

    const newPath = args[0].toUpperCase();
    
    if (newPath === '..') {
      const parts = currentPath.split('\\');
      if (parts.length > 1) {
        parts.pop();
        setCurrentPath(parts.join('\\') || 'C:\\');
      }
      return [];
    }

    if (newPath.startsWith('C:\\')) {
      setCurrentPath(newPath);
      return [];
    }

    if (newPath === 'SYSTEM' || newPath === 'SYSTEM32') {
      setCurrentPath(`${currentPath}\\${newPath}`);
      return [];
    }

    return [`The system cannot find the path specified.`];
  };

  const handleType = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['The syntax of the command is incorrect.'];
    }

    const filename = args[0];
    const path = `C:\\My Documents\\${filename}`;
    const file = getFile(path);
    
    if (file) {
      return file.content.split('\n');
    }

    return [`The system cannot find the file specified.`];
  };

  const handleDel = (args: string[]): string[] => {
    if (args.length === 0) {
      return ['The syntax of the command is incorrect.'];
    }

    const filename = args[0];
    const path = `C:\\My Documents\\${filename}`;
    deleteFile(path);
    
    return [`Deleted: ${filename}`];
  };

  const handleHelp = (): string[] => {
    return [
      'For more information on a specific command, type HELP command-name',
      '',
      'CD          Displays the name of or changes the current directory.',
      'CLS         Clears the screen.',
      'DATE        Displays or sets the date.',
      'DEL         Deletes one or more files.',
      'DIR         Displays a list of files and subdirectories in a directory.',
      'ECHO        Displays messages.',
      'EXIT        Quits the CMD.EXE program.',
      'HELP        Provides Help information for Windows commands.',
      'TIME        Displays or sets the system time.',
      'TYPE        Displays the contents of a text file.',
      'VER         Displays the Windows version.',
    ];
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className={styles.container} onClick={() => inputRef.current?.focus()}>
      <div ref={terminalRef} className={styles.terminal}>
        {history.map((entry, index) => (
          <div key={index}>
            {entry.command && (
              <div className={styles.commandLine}>
                <span className={styles.prompt}>{currentPath}&gt;</span>
                <span className={styles.command}>{entry.command}</span>
              </div>
            )}
            {entry.output.map((line, lineIndex) => (
              <div key={lineIndex} className={styles.output}>
                {line}
              </div>
            ))}
          </div>
        ))}
        <div className={styles.commandLine}>
          <span className={styles.prompt}>{currentPath}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
