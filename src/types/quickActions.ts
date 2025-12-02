/**
 * Type-safe quick action IDs
 */
export type QuickActionId =
  | 'play-gloom'
  | 'gloom-controls'
  | 'gloom-history'
  | 'gloom-tips'
  | 'browse-web'
  | 'web-tips'
  | 'web-history'
  | 'web-features'
  | 'launch-bombfinder'
  | 'how-to-play'
  | 'bombfinder-tips'
  | 'bombfinder-history'
  | 'launch-wordwrite'
  | 'wordwrite-shortcuts'
  | 'wordwrite-tips'
  | 'wordwrite-history';

/**
 * Map of app names to their launch action IDs
 */
export const APP_LAUNCH_ACTIONS = {
  'Gloom': 'play-gloom',
  'Web Finder': 'browse-web',
  'Bomb Finder': 'launch-bombfinder',
  'WordWrite': 'launch-wordwrite',
} as const;

export type AppName = keyof typeof APP_LAUNCH_ACTIONS;
