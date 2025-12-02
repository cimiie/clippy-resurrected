/**
 * Clippy Quick Actions and Context Configuration
 * 
 * This file contains the mapping of action IDs to their contexts and quick actions
 * for the Clippy assistant's contextual help system.
 */

import { QuickAction } from '@/types/clippy';
import { QuickActionId } from '@/types/quickActions';

export interface ActionContext {
  context: string;
  topic: string;
}

/**
 * Map of action IDs to their context and topic information
 */
export const ACTION_CONTEXT_MAP: Record<QuickActionId, ActionContext> = {
  'play-gloom': {
    context: 'The user just launched Gloom, a classic first-person shooter game.',
    topic: 'gloom game launched ready to play controls tips classic fps',
  },
  'gloom-controls': {
    context: 'The user wants to learn the controls for playing Gloom.',
    topic: 'gloom game controls keyboard mouse movement shooting weapons',
  },
  'gloom-history': {
    context: 'The user wants to know about the history of Gloom.',
    topic: 'gloom history classic fps game revolutionary shooter',
  },
  'gloom-tips': {
    context: 'The user wants survival tips for playing Gloom.',
    topic: 'gloom gameplay tips strategy survival secrets tricks',
  },
  'browse-web': {
    context: 'The user just opened Web Finder to browse the web.',
    topic: 'web finder opened ready to browse web navigation features',
  },
  'web-tips': {
    context: 'The user wants tips for browsing with Web Finder.',
    topic: 'web finder browsing tips navigation shortcuts favorites',
  },
  'web-history': {
    context: 'The user wants to know about the history of Web Finder.',
    topic: 'web finder history web browser evolution internet browsing',
  },
  'web-features': {
    context: 'The user wants to learn about Web Finder features.',
    topic: 'web finder features favorites bookmarks navigation tools',
  },
  'launch-bombfinder': {
    context: 'The user just opened Bomb Finder, a classic puzzle game.',
    topic: 'bomb finder game rules strategy tips history',
  },
  'how-to-play': {
    context: 'The user wants to learn how to play Bomb Finder.',
    topic: 'bomb finder rules gameplay instructions beginner guide',
  },
  'bombfinder-tips': {
    context: 'The user wants advanced tips for playing Bomb Finder.',
    topic: 'bomb finder strategy advanced techniques patterns',
  },
  'bombfinder-history': {
    context: 'The user wants to know about the history of Bomb Finder.',
    topic: 'bomb finder history origin classic puzzle game facts trivia',
  },
  'launch-wordwrite': {
    context: 'The user just opened WordWrite, a simple text editor.',
    topic: 'wordwrite text editor features shortcuts tips',
  },
  'wordwrite-shortcuts': {
    context: 'The user wants to learn keyboard shortcuts for WordWrite.',
    topic: 'wordwrite keyboard shortcuts hotkeys commands quick access',
  },
  'wordwrite-tips': {
    context: 'The user wants tips and tricks for using WordWrite effectively.',
    topic: 'wordwrite tips tricks productivity features hidden functions',
  },
  'wordwrite-history': {
    context: 'The user wants to know about the history of WordWrite.',
    topic: 'wordwrite history origin windows evolution facts trivia',
  },
};

/**
 * Map of action IDs to their available quick actions
 */
export const QUICK_ACTIONS_MAP: Partial<Record<QuickActionId, QuickAction[]>> = {

};

/**
 * Get quick actions for a given action ID
 */
export function getQuickActionsForContext(actionId: QuickActionId): QuickAction[] {
  return QUICK_ACTIONS_MAP[actionId] || [];
}

/**
 * Get context information for a given action ID
 */
export function getActionContext(actionId: QuickActionId): ActionContext | undefined {
  return ACTION_CONTEXT_MAP[actionId];
}
