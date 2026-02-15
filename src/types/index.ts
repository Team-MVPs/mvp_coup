/**
 * Common TypeScript type definitions for the Coup game
 */

// Character/Card Types
export type CharacterType = 'Duke' | 'Assassin' | 'Contessa' | 'Captain' | 'Ambassador';

// Move Types
export type MoveType =
  | 'general_income'
  | 'foreign_aid'
  | 'duke'
  | 'exchange_cards'
  | 'assassinate'
  | 'steal'
  | 'coup'
  | 'bluff'
  | 'blocked';

// Response Types
export type ResponseType = 'confirm' | 'block' | 'bluff';

// Player Data Structure
export interface Player {
  name: string;
  cards: CharacterType[];
  coins: number;
  inGame: boolean;
}

// Move Structure
export interface Move {
  type: MoveType;
  player?: string;
  to?: string;
  card?: CharacterType;
}

// Block Structure
export interface Block {
  playerID: string;
  playerName: string;
  character?: CharacterType;
  card?: string;
  letGo?: boolean;
}

// Bluff Structure
export interface Bluff {
  playerID: string;
  playerName: string;
  targetPlayerID?: string;
  targetPlayerName?: string;
}

// Turn Data Structure
export interface Turn {
  playerName: string;
  playerID: string;
  turn: string;
  move: Move;
  confirmations: number;
  blocks: Block[];
  bluffs: Bluff[];
  ambassadorBluff: boolean;
  moveExecuted?: boolean;
  bluffLoser?: {
    playerID: string;
    playerName: string;
  };
}

// Room Data Structure
export interface Room {
  startGame: boolean;
  turn: number;
  winner?: string;
  cards: CharacterType[];
}

// Player Context Type
export interface PlayerContextType {
  playerID: string;
  setPlayerID: (id: string) => void;
  playerIndex: number;
  setPlayerIndex: (index: number) => void;
}

// Room Context Type
export interface RoomContextType {
  roomName: string;
  setRoomName: (name: string) => void;
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
  playerNamesMapping: Record<string, string>;
  setPlayerNamesMapping: (mapping: Record<string, string>) => void;
}

// Firebase Snapshot Type
export interface FirebaseDocumentData {
  [key: string]: any;
}

// Player Collection Data (for fetching multiple players)
export interface PlayersData {
  [playerID: string]: Player;
}

// Validation Error Types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Game State Types
export interface GameState {
  roomData: Room | null;
  playerData: Player | null;
  turnData: Turn | null;
  allPlayers: PlayersData;
}

// Component Props Types
export interface BaseComponentProps {
  roomName: string;
  playerID: string;
}

// Move List Item
export interface MoveListItem {
  type: MoveType;
  label: string;
  coinRequirement?: number;
  requiresTarget?: boolean;
}

// Past Move Display
export interface PastMoveDisplay {
  turnNumber: number;
  playerName: string;
  moveType: MoveType;
  target?: string;
  result?: string;
}

// Character Card Definition
export interface CharacterCard {
  name: CharacterType;
  action: string;
  counterAction?: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Async Operation States
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';

// Custom Hook Return Types
export interface UsePlayerDataReturn {
  playerData: Player | null;
  loading: boolean;
  error: string | null;
}

export interface UseRoomDataReturn {
  roomData: Room | null;
  loading: boolean;
  error: string | null;
}

export interface UseTurnDataReturn {
  turnData: Turn | null;
  loading: boolean;
  error: string | null;
}

export interface UsePlayersCollectionReturn {
  players: PlayersData;
  loading: boolean;
  error: string | null;
}
