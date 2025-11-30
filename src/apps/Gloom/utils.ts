// Inline these functions for performance - they're called in hot loops
export const normalizeAngle = (angle: number): number => {
  let normalized = angle;
  while (normalized > Math.PI) normalized -= 2 * Math.PI;
  while (normalized < -Math.PI) normalized += 2 * Math.PI;
  return normalized;
};

// Cache for line of sight checks to avoid redundant calculations
const losCache = new Map<string, boolean>();
let cacheFrame = 0;

export const checkLineOfSight = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  map: number[][]
): boolean => {
  // Clear cache every 60 frames to prevent memory bloat
  if (++cacheFrame > 60) {
    losCache.clear();
    cacheFrame = 0;
  }

  const key = `${x1.toFixed(1)},${y1.toFixed(1)},${x2.toFixed(1)},${y2.toFixed(1)}`;
  if (losCache.has(key)) return losCache.get(key)!;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.floor(distance * 10));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const checkX = Math.floor(x1 + dx * t);
    const checkY = Math.floor(y1 + dy * t);

    if (
      checkX < 0 ||
      checkX >= map[0].length ||
      checkY < 0 ||
      checkY >= map.length ||
      map[checkY][checkX] === 1
    ) {
      losCache.set(key, false);
      return false;
    }
  }
  
  losCache.set(key, true);
  return true;
};
