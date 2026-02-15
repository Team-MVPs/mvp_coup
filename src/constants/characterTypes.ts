/**
 * Character/Card type constants for the Coup game
 */

import { CharacterType } from '../types';

export const CHAR_DUKE: CharacterType = 'Duke';
export const CHAR_ASSASSIN: CharacterType = 'Assassin';
export const CHAR_CONTESSA: CharacterType = 'Contessa';
export const CHAR_CAPTAIN: CharacterType = 'Captain';
export const CHAR_AMBASSADOR: CharacterType = 'Ambassador';

// All character types in an array
export const ALL_CHARACTERS: CharacterType[] = [
  CHAR_DUKE,
  CHAR_ASSASSIN,
  CHAR_CONTESSA,
  CHAR_CAPTAIN,
  CHAR_AMBASSADOR,
];

// Move to character card mappings
export const MOVE_TO_CARD_MAP: Record<string, CharacterType> = {
  foreign_aid: CHAR_DUKE,
  duke: CHAR_DUKE,
  exchange_cards: CHAR_AMBASSADOR,
  assassinate: CHAR_ASSASSIN,
  steal: CHAR_CAPTAIN,
  Contessa: CHAR_CONTESSA,
};
