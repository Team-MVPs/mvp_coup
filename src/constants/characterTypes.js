/**
 * Character/Card type constants for the Coup game
 */

export const CHAR_DUKE = 'Duke';
export const CHAR_ASSASSIN = 'Assassin';
export const CHAR_CONTESSA = 'Contessa';
export const CHAR_CAPTAIN = 'Captain';
export const CHAR_AMBASSADOR = 'Ambassador';

// All character types in an array
export const ALL_CHARACTERS = [
  CHAR_DUKE,
  CHAR_ASSASSIN,
  CHAR_CONTESSA,
  CHAR_CAPTAIN,
  CHAR_AMBASSADOR,
];

// Move to character card mappings
export const MOVE_TO_CARD_MAP = {
  foreign_aid: CHAR_DUKE,
  duke: CHAR_DUKE,
  exchange_cards: CHAR_AMBASSADOR,
  assassinate: CHAR_ASSASSIN,
  steal: CHAR_CAPTAIN,
  Contessa: CHAR_CONTESSA,
};
