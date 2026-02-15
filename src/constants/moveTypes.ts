/**
 * Move type constants for the Coup game
 */

import { MoveType } from '../types';

// Basic moves
export const MOVE_GENERAL_INCOME: MoveType = 'general_income';
export const MOVE_COUP: MoveType = 'coup';
export const MOVE_FOREIGN_AID: MoveType = 'foreign_aid';

// Character-specific moves
export const MOVE_DUKE: MoveType = 'duke';
export const MOVE_EXCHANGE_CARDS: MoveType = 'exchange_cards';
export const MOVE_ASSASSINATE: MoveType = 'assassinate';
export const MOVE_STEAL: MoveType = 'steal';

// Special move states
export const MOVE_BLUFF: MoveType = 'bluff';
export const MOVE_BLOCKED: MoveType = 'blocked';

// Move type mappings
export const MOVE_TYPE_LABELS: Record<MoveType, string> = {
  [MOVE_GENERAL_INCOME]: 'Take General Income',
  [MOVE_FOREIGN_AID]: 'Take Foreign Aid',
  [MOVE_DUKE]: 'Take 3 as Duke',
  [MOVE_EXCHANGE_CARDS]: 'Exchange your cards as Ambassador',
  [MOVE_STEAL]: 'Steal 2 from a player as Captain',
  [MOVE_ASSASSINATE]: 'Assassinate someone you dislike!',
  [MOVE_COUP]: 'Coup a scrub',
  [MOVE_BLUFF]: 'Bluff',
  [MOVE_BLOCKED]: 'Blocked',
};
