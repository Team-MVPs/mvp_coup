/**
 * Move type constants for the Coup game
 */

// Basic moves
export const MOVE_GENERAL_INCOME = 'general_income';
export const MOVE_COUP = 'coup';
export const MOVE_FOREIGN_AID = 'foreign_aid';

// Character-specific moves
export const MOVE_DUKE = 'duke';
export const MOVE_EXCHANGE_CARDS = 'exchange_cards';
export const MOVE_ASSASSINATE = 'assassinate';
export const MOVE_STEAL = 'steal';

// Special move states
export const MOVE_BLUFF = 'bluff';
export const MOVE_BLOCKED = 'blocked';

// Move type mappings
export const MOVE_TYPE_LABELS = {
  [MOVE_GENERAL_INCOME]: 'Take General Income',
  [MOVE_FOREIGN_AID]: 'Take Foreign Aid',
  [MOVE_DUKE]: 'Take 3 as Duke',
  [MOVE_EXCHANGE_CARDS]: 'Exchange your cards as Ambassador',
  [MOVE_STEAL]: 'Steal 2 from a player as Captain',
  [MOVE_ASSASSINATE]: 'Assassinate someone you dislike!',
  [MOVE_COUP]: 'Coup a scrub',
};
