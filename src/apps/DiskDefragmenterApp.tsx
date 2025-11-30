'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './DiskDefragmenterApp.module.css';

type BlockType = 0 | 1 | 2 | 3 | 4 | 5; // 0=free(black), 1=contiguous-blue, 2=fragmented(red), 3=contiguous-green, 4=system(cyan), 5=reading/writing(yellow)

export default function DiskDefragmenterApp() {
  const [isDefragging, setIsDefragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to defragment');
  const [, setPhase] = useState<'idle' | 'analyzing' | 'defragging' | 'optimizing' | 'complete'>('idle');
  const [currentBlock, setCurrentBlock] = useState(-1);
  
  // Generate initial fragmented disk - lots of red fragmented blocks
  const [diskMap, setDiskMap] = useState<BlockType[]>(() => {
    const map: BlockType[] = [];
    // Create a heavily fragmented disk (12 columns x 10 rows = 120 blocks for square aspect)
    for (let i = 0; i < 120; i++) {
      const rand = Math.random();
      if (rand < 0.15) map.push(0); // 15% free space (black)
      else if (rand < 0.55) map.push(2); // 40% fragmented files (RED - scattered pieces)
      else if (rand < 0.75) map.push(1); // 20% contiguous files (blue)
      else if (rand < 0.90) map.push(3); // 15% contiguous files (green)
      else map.push(4); // 10% system files (cyan)
    }
    // Shuffle to make it look fragmented
    for (let i = map.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [map[i], map[j]] = [map[j], map[i]];
    }
    return map;
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDefragging) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.5, 100);
        
        // Update phase based on progress
        if (newProgress < 20) {
          setPhase('analyzing');
          setStatus('Analyzing disk structure...');
        } else if (newProgress < 85) {
          setPhase('defragging');
          setStatus('Defragmenting files...');
          
          // Classic Windows defrag: Convert RED fragmented blocks into BLUE/GREEN contiguous blocks
          setDiskMap(prevMap => {
            const newMap = [...prevMap];
            
            // Find a red (fragmented) block
            const redIndex = newMap.findIndex(v => v === 2);
            
            if (redIndex !== -1) {
              // Show reading animation on the red block
              newMap[redIndex] = 5;
              setCurrentBlock(redIndex);
              
              setTimeout(() => {
                setDiskMap(map => {
                  const updated = [...map];
                  // Convert red fragmented block to blue or green contiguous block (randomly)
                  updated[redIndex] = Math.random() < 0.5 ? 1 : 3;
                  setCurrentBlock(-1);
                  return updated;
                });
              }, 50);
            } else {
              // No more red blocks, now consolidate free space
              // Move contiguous blocks (1, 3, 4) to the front, free space to the back
              const firstFree = newMap.findIndex(v => v === 0);
              const dataAfterFree = newMap.findIndex((v, i) => i > firstFree && (v === 1 || v === 3 || v === 4));
              
              if (firstFree !== -1 && dataAfterFree !== -1) {
                const blockType = newMap[dataAfterFree];
                newMap[dataAfterFree] = 5;
                setCurrentBlock(dataAfterFree);
                
                setTimeout(() => {
                  setDiskMap(map => {
                    const updated = [...map];
                    updated[firstFree] = blockType;
                    updated[dataAfterFree] = 0;
                    setCurrentBlock(-1);
                    return updated;
                  });
                }, 50);
              }
            }
            
            return newMap;
          });
        } else if (newProgress < 100) {
          setPhase('optimizing');
          setStatus('Optimizing file placement...');
          setCurrentBlock(-1);
        } else {
          setPhase('complete');
          setStatus('Defragmentation complete!');
          setIsDefragging(false);
          setCurrentBlock(-1);
        }
        
        return newProgress;
      });
    }, 80);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDefragging]);

  const handleStart = () => {
    setIsDefragging(true);
    setProgress(0);
    setPhase('analyzing');
    setStatus('Starting defragmentation...');
  };

  const handleStop = () => {
    setIsDefragging(false);
    setPhase('idle');
    setStatus('Defragmentation stopped');
    setCurrentBlock(-1);
  };

  const getBlockColor = (value: BlockType, index: number) => {
    // Highlight current block being processed
    if (index === currentBlock) return '#ffff00';
    
    switch (value) {
      case 0: return '#ffffff'; // Free space (white)
      case 1: return '#0000ff'; // Contiguous files (blue - organized)
      case 2: return '#ff0000'; // Fragmented files (RED - scattered pieces)
      case 3: return '#00ff00'; // Contiguous files (green - organized)
      case 4: return '#00ffff'; // System files (cyan)
      case 5: return '#ffff00'; // Reading/writing (yellow)
      default: return '#808080';
    }
  };
  
  // Calculate statistics
  const totalBlocks = diskMap.length;
  const freeBlocks = diskMap.filter(v => v === 0).length;
  const blueBlocks = diskMap.filter(v => v === 1).length;
  const fragBlocks = diskMap.filter(v => v === 2).length;
  const greenBlocks = diskMap.filter(v => v === 3).length;

  const contiguousBlocks = blueBlocks + greenBlocks;
  const fragPercent = Math.round((fragBlocks / totalBlocks) * 100);
  const usedBlocks = totalBlocks - freeBlocks;
  const freePercent = Math.round((freeBlocks / totalBlocks) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.header}>
            <div className={styles.driveIcon}>💾</div>
            <div>
              <div className={styles.driveName}>Drive C:</div>
              <div className={styles.driveSize}>2.00 GB</div>
            </div>
          </div>

          <div className={styles.statsPanel}>
            <div className={styles.statRow}>
              <span>Disk space:</span>
              <span>{Math.round((usedBlocks / totalBlocks) * 2000)} MB used</span>
            </div>
            <div className={styles.statRow}>
              <span>Free space:</span>
              <span>{Math.round((freeBlocks / totalBlocks) * 2000)} MB ({freePercent}%)</span>
            </div>
            <div className={styles.statRow}>
              <span>Total files:</span>
              <span>{usedBlocks} blocks</span>
            </div>
            <div className={styles.statRow}>
              <span>Fragmented:</span>
              <span className={fragBlocks > 0 ? styles.warning : styles.success}>
                {fragBlocks} blocks ({fragPercent}%)
              </span>
            </div>
            <div className={styles.statRow}>
              <span>Contiguous:</span>
              <span className={styles.success}>{contiguousBlocks} blocks</span>
            </div>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendTitle}>Legend:</div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#ff0000' }} />
              <span>Fragmented files</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#0000ff' }} />
              <span>Contiguous files</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#00ff00' }} />
              <span>Contiguous files</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#ffffff', border: '1px solid #000' }} />
              <span>Free space</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#00ffff' }} />
              <span>System files</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button 
              className={styles.button} 
              onClick={handleStart}
              disabled={isDefragging}
            >
              Start
            </button>
            <button 
              className={styles.button} 
              onClick={handleStop}
              disabled={!isDefragging}
            >
              Stop
            </button>
            <button 
              className={styles.button} 
              onClick={() => {
            // Reset to fragmented state - lots of red blocks
            const map: BlockType[] = [];
            for (let i = 0; i < 120; i++) {
              const rand = Math.random();
              if (rand < 0.15) map.push(0); // 15% free
              else if (rand < 0.55) map.push(2); // 40% fragmented (RED)
              else if (rand < 0.75) map.push(1); // 20% blue
              else if (rand < 0.90) map.push(3); // 15% green
              else map.push(4); // 10% system (cyan)
            }
            // Shuffle
            for (let i = map.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [map[i], map[j]] = [map[j], map[i]];
            }
            setDiskMap(map);
            setProgress(0);
            setPhase('idle');
            setStatus('Ready to defragment');
          }}
          disabled={isDefragging}
        >
          Reset
        </button>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.diskMap}>
            <div className={styles.mapGrid}>
              {diskMap.map((value, index) => (
                <div
                  key={index}
                  className={`${styles.mapBlock} ${index === currentBlock ? styles.active : ''}`}
                  style={{ backgroundColor: getBlockColor(value, index) }}
                />
              ))}
            </div>
          </div>

          <div className={styles.status}>
            <div className={styles.statusText}>{status}</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressText}>{Math.round(progress)}% Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
