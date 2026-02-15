/**
 * Move creation functions
 */

import { createTurn } from '../api/turnApi';
import { incrementConfirmations } from '../api/turnApi';
import {
  MOVE_GENERAL_INCOME,
  MOVE_COUP,
  MOVE_FOREIGN_AID,
  MOVE_DUKE,
  MOVE_EXCHANGE_CARDS,
  MOVE_ASSASSINATE,
  MOVE_STEAL,
  MOVE_TYPE_LABELS,
} from '../constants/moveTypes';
import { Move as MoveInterface, MoveType } from '../types';

/**
 * Creates a move object
 * param type - The type of move
 * param player - The player making the move
 * param to - The target player (if applicable)
 * returns Move object
 */
export const Move = (type: MoveType, player: string, to: string | null): MoveInterface => ({
  type,
  player,
  to: to || undefined,
});

/**
 * Creates a turn in the database
 * param roomName - The name of the room
 * param turn - The turn number
 * param playerName - The player's name
 * param playerID - The player's ID
 * param move - The move object
 * returns Promise that resolves when turn is created
 */
export const updateTurnInDB = async (
  roomName: string,
  turn: number,
  playerName: string,
  playerID: string,
  move: MoveInterface
): Promise<void> => {
  try {
    await createTurn(roomName, turn, playerName, playerID, move);
  } catch (error) {
    console.error('Error creating turn:', error);
    throw error;
  }
};

/**
 * Creates a move handler function
 * param type - The type of move
 * returns Move handler function
 */
type MoveHandler = (
  roomName: string,
  turn: number,
  playerName: string,
  activePlayerID: string,
  setConfirmed: ((value: boolean) => void) | null
) => () => Promise<void>;

const createMoveHandler = (type: MoveType): MoveHandler => {
  return (roomName: string, turn: number, playerName: string, activePlayerID: string, setConfirmed: ((value: boolean) => void) | null) => {
    return async (): Promise<void> => {
      try {
        const move = Move(type, playerName, null);
        await updateTurnInDB(roomName, turn, playerName, activePlayerID, move);
        if (setConfirmed !== null) setConfirmed(true);
      } catch (error) {
        console.error('Error handling move:', error);
      }
    };
  };
};

/**
 * All available moves mapped to their handlers
 */
export const all_moves: Record<string, MoveHandler> = {
  [MOVE_TYPE_LABELS[MOVE_GENERAL_INCOME]]: createMoveHandler(MOVE_GENERAL_INCOME),
  [MOVE_TYPE_LABELS[MOVE_FOREIGN_AID]]: createMoveHandler(MOVE_FOREIGN_AID),
  [MOVE_TYPE_LABELS[MOVE_DUKE]]: createMoveHandler(MOVE_DUKE),
  [MOVE_TYPE_LABELS[MOVE_EXCHANGE_CARDS]]: createMoveHandler(MOVE_EXCHANGE_CARDS),
  [MOVE_TYPE_LABELS[MOVE_STEAL]]: createMoveHandler(MOVE_STEAL),
  [MOVE_TYPE_LABELS[MOVE_ASSASSINATE]]: createMoveHandler(MOVE_ASSASSINATE),
  [MOVE_TYPE_LABELS[MOVE_COUP]]: createMoveHandler(MOVE_COUP),
};

/**
 * Confirms a turn by incrementing confirmations
 * param roomName - The name of the room
 * param turn - The turn number
 * param setConfirmed - State setter for confirmed
 * param setWaitingMessage - State setter for waiting message
 * param setMove - State setter for move
 * returns Promise that resolves when turn is confirmed
 */
export const confirmTurn = async (
  roomName: string,
  turn: number,
  setConfirmed: ((value: boolean) => void) | null,
  setWaitingMessage: ((value: string) => void) | null,
  setMove: ((value: string) => void) | null
): Promise<void> => {
  try {
    if (setConfirmed !== null) setConfirmed(true);
    if (setWaitingMessage !== null) setWaitingMessage('Waiting for others');
    if (setMove !== null) setMove('');
    await incrementConfirmations(roomName, turn);
  } catch (error) {
    console.error('Error confirming turn:', error);
  }
};
