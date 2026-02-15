/**
 * Game configuration constants for Coup
 */

// Initial game setup
export const INITIAL_COINS_PER_PLAYER = 2;
export const INITIAL_CARDS_PER_PLAYER = 2;

// Move costs
export const COUP_COST = 7;
export const ASSASSINATE_COST = 3;

// Income amounts
export const GENERAL_INCOME_AMOUNT = 1;
export const FOREIGN_AID_AMOUNT = 2;
export const DUKE_INCOME_AMOUNT = 3;
export const CAPTAIN_STEAL_AMOUNT = 2;

// Deck scaling based on room size
export const CARDS_PER_TYPE_SMALL = 3; // 2-6 players
export const CARDS_PER_TYPE_MEDIUM = 5; // 7-10 players
export const CARDS_PER_TYPE_LARGE = 6; // 10+ players

// Room size thresholds
export const MEDIUM_ROOM_THRESHOLD = 6;
export const LARGE_ROOM_THRESHOLD = 10;

// Game state
export const MIN_PLAYERS_TO_START = 2;
