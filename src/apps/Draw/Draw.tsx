'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import styles from './Draw.module.css';

type Tool = 'pencil' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle' | 'spray' | 'eyedropper' | 'roundrect';

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const { saveFile } = useFileSystem();

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#808040', '#004040', '#0080FF', '#004080', '#8000FF', '#804000', '#FFFFFF', '#C0C0C0',
    '#FF0000', '#00FF00', '#FFFF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF80', '#80FFFF',
    '#FF8080', '#80FF80', '#FF80FF', '#80FF00'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    // Save canvas state for shape tools
    if (['line', 'rectangle', 'circle', 'roundrect', 'polygon'].includes(tool)) {
      setTempCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'spray') {
      // Spray paint effect
      const density = 20;
      const radius = lineWidth * 5;
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const sprayX = pos.x + Math.cos(angle) * distance;
        const sprayY = pos.y + Math.sin(angle) * distance;
        ctx.fillStyle = color;
        ctx.fillRect(sprayX, sprayY, 1, 1);
      }
    } else if (['line', 'rectangle', 'circle', 'roundrect'].includes(tool) && tempCanvas) {
      // Restore canvas and draw preview
      ctx.putImageData(tempCanvas, 0, 0);
      ctx.beginPath();

      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rectangle') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'roundrect') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        const radius = 10;
        ctx.beginPath();
        ctx.moveTo(startPos.x + radius, startPos.y);
        ctx.lineTo(startPos.x + width - radius, startPos.y);
        ctx.quadraticCurveTo(startPos.x + width, startPos.y, startPos.x + width, startPos.y + radius);
        ctx.lineTo(startPos.x + width, startPos.y + height - radius);
        ctx.quadraticCurveTo(startPos.x + width, startPos.y + height, startPos.x + width - radius, startPos.y + height);
        ctx.lineTo(startPos.x + radius, startPos.y + height);
        ctx.quadraticCurveTo(startPos.x, startPos.y + height, startPos.x, startPos.y + height - radius);
        ctx.lineTo(startPos.x, startPos.y + radius);
        ctx.quadraticCurveTo(startPos.x, startPos.y, startPos.x + radius, startPos.y);
        ctx.stroke();
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleEyedropper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e);
    const imageData = ctx.getImageData(pos.x, pos.y, 1, 1);
    const data = imageData.data;
    const pickedColor = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1)}`;
    setColor(pickedColor);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setTempCanvas(null);
  };

  const floodFill = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const targetColor = getPixelColor(data, x, y, canvas.width);
    const fillColorRgb = hexToRgb(color);

    if (colorsMatch(targetColor, fillColorRgb)) return;

    const stack: Array<{ x: number; y: number }> = [{ x, y }];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const point = stack.pop();
      if (!point) continue;

      const key = `${point.x},${point.y}`;
      if (visited.has(key)) continue;
      if (point.x < 0 || point.x >= canvas.width || point.y < 0 || point.y >= canvas.height) continue;

      const currentColor = getPixelColor(data, point.x, point.y, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      visited.add(key);
      setPixelColor(data, point.x, point.y, canvas.width, fillColorRgb);

      stack.push({ x: point.x + 1, y: point.y });
      stack.push({ x: point.x - 1, y: point.y });
      stack.push({ x: point.x, y: point.y + 1 });
      stack.push({ x: point.x, y: point.y - 1 });
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: { r: number; g: number; b: number }) => {
    const index = (y * width + x) * 4;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const colorsMatch = (c1: { r: number; g: number; b: number; a?: number }, c2: { r: number; g: number; b: number }) => {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          saveFile('painting.png', base64);
          alert('Saved to My Documents\\painting.png');
        };
        reader.readAsDataURL(blob);
      }
    });
  };

  const toggleMenu = (menu: string) => {
    setShowMenu(showMenu === menu ? null : menu);
  };

  return (
    <div className={styles.container}>
      {/* Menu Bar */}
      <div className={styles.menuBar}>
        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('file')}>
            File
          </button>
          {showMenu === 'file' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={() => { clearCanvas(); setShowMenu(null); }}>
                New
              </button>
              <button className={styles.dropdownItem} disabled>
                Open...
              </button>
              <button className={styles.dropdownItem} onClick={() => { handleSave(); setShowMenu(null); }}>
                Save
              </button>
              <button className={styles.dropdownItem} disabled>
                Save As...
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Print Preview
              </button>
              <button className={styles.dropdownItem} disabled>
                Page Setup...
              </button>
              <button className={styles.dropdownItem} disabled>
                Print...
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Set As Wallpaper (Tiled)
              </button>
              <button className={styles.dropdownItem} disabled>
                Set As Wallpaper (Centered)
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Exit
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('edit')}>
            Edit
          </button>
          {showMenu === 'edit' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} disabled>
                Undo
              </button>
              <button className={styles.dropdownItem} disabled>
                Repeat
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Cut
              </button>
              <button className={styles.dropdownItem} disabled>
                Copy
              </button>
              <button className={styles.dropdownItem} disabled>
                Paste
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} onClick={() => { clearCanvas(); setShowMenu(null); }}>
                Clear Selection
              </button>
              <button className={styles.dropdownItem} disabled>
                Select All
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Copy To...
              </button>
              <button className={styles.dropdownItem} disabled>
                Paste From...
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('view')}>
            View
          </button>
          {showMenu === 'view' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} disabled>
                Tool Box
              </button>
              <button className={styles.dropdownItem} disabled>
                Color Box
              </button>
              <button className={styles.dropdownItem} disabled>
                Status Bar
              </button>
              <button className={styles.dropdownItem} disabled>
                Text Toolbar
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                Zoom
              </button>
              <button className={styles.dropdownItem} disabled>
                View Bitmap
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('image')}>
            Image
          </button>
          {showMenu === 'image' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} disabled>
                Flip/Rotate...
              </button>
              <button className={styles.dropdownItem} disabled>
                Stretch/Skew...
              </button>
              <button className={styles.dropdownItem} disabled>
                Invert Colors
              </button>
              <button className={styles.dropdownItem} disabled>
                Attributes...
              </button>
              <button className={styles.dropdownItem} onClick={() => { clearCanvas(); setShowMenu(null); }}>
                Clear Image
              </button>
              <button className={styles.dropdownItem} disabled>
                Draw Opaque
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('options')}>
            Options
          </button>
          {showMenu === 'options' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} disabled>
                Edit Colors...
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button className={styles.menuButton} onClick={() => toggleMenu('help')}>
            Help
          </button>
          {showMenu === 'help' && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} disabled>
                Help Topics
              </button>
              <div className={styles.dropdownSeparator} />
              <button className={styles.dropdownItem} disabled>
                About Paint
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div className={styles.workArea}>
          {/* Tool Box - LEFT SIDE */}
          <div className={styles.toolBox}>
            <div className={styles.toolGrid}>
              <button
                className={`${styles.toolButton} ${tool === 'pencil' ? styles.active : ''}`}
                onClick={() => setTool('pencil')}
                title="Pencil"
              >
                ✏️
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'eraser' ? styles.active : ''}`}
                onClick={() => setTool('eraser')}
                title="Eraser"
              >
                🧹
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'fill' ? styles.active : ''}`}
                onClick={() => setTool('fill')}
                title="Fill With Color"
              >
                🪣
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'eyedropper' ? styles.active : ''}`}
                onClick={() => setTool('eyedropper')}
                title="Pick Color"
              >
                👁️
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'spray' ? styles.active : ''}`}
                onClick={() => setTool('spray')}
                title="Airbrush"
              >
                💨
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'line' ? styles.active : ''}`}
                onClick={() => setTool('line')}
                title="Line"
              >
                ╱
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'rectangle' ? styles.active : ''}`}
                onClick={() => setTool('rectangle')}
                title="Rectangle"
              >
                ▭
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'circle' ? styles.active : ''}`}
                onClick={() => setTool('circle')}
                title="Ellipse"
              >
                ○
              </button>
              <button
                className={`${styles.toolButton} ${tool === 'roundrect' ? styles.active : ''}`}
                onClick={() => setTool('roundrect')}
                title="Rounded Rectangle"
              >
                ▢
              </button>
            </div>

            {/* Line Width Options */}
            <div className={styles.lineWidthBox}>
              {[1, 2, 3, 5, 8].map(width => (
                <div
                  key={width}
                  className={`${styles.lineWidthOption} ${lineWidth === width ? styles.selected : ''}`}
                  onClick={() => setLineWidth(width)}
                >
                  <div 
                    className={`${styles.lineWidthBar} ${lineWidth === width ? styles.selected : ''}`}
                    style={{ height: width, background: lineWidth === width ? '#fff' : '#000' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className={styles.canvasArea}>
            {/* Canvas with Scrollable Area */}
            <div className={styles.canvasScroll}>
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                width={640}
                height={480}
                onMouseDown={(e) => {
                  if (tool === 'fill') {
                    const pos = getMousePos(e);
                    floodFill(Math.floor(pos.x), Math.floor(pos.y));
                  } else if (tool === 'eyedropper') {
                    handleEyedropper(e);
                  } else {
                    startDrawing(e);
                  }
                }}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  cursor: tool === 'fill' ? 'crosshair' : 
                         tool === 'pencil' ? 'crosshair' :
                         tool === 'spray' ? 'crosshair' :
                         tool === 'eraser' ? 'cell' : 'default'
                }}
              />
            </div>

            {/* Status Bar */}
            <div className={styles.statusBar}>
              <div className={`${styles.statusItem} ${styles.statusItemFlex}`}>
                For Help, click Help Topics on the Help Menu.
              </div>
              <div className={styles.statusItem}>
                640x480px
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette - BOTTOM */}
        <div className={styles.colorPalette}>
          {/* Current Colors Display */}
          <div className={styles.colorDisplay}>
            <div className={styles.colorPrimary} style={{ background: color }} />
            <div className={styles.colorSecondary} style={{ background: secondaryColor }} />
          </div>

          {/* Color Grid */}
          <div className={styles.colorGrid}>
            {colors.map((c) => (
              <div
                key={c}
                className={`${styles.colorSwatch} ${color === c ? styles.selected : ''}`}
                onClick={() => setColor(c)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSecondaryColor(c);
                }}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
