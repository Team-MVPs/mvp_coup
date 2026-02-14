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

/**
 * Creates a move object
 * @param {string} type - The type of move
 * @param {string} player - The player making the move
 * @param {string} to - The target player (if applicable)
 * @returns {Object} - Move object
 */
export const Move = (type, player, to) => ({
  type,
  player,
  to,
});

/**
 * Creates a turn in the database
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {string} playerName - The player's name
 * @param {string} playerID - The player's ID
 * @param {Object} move - The move object
 * @returns {Promise<void>}
 */
export const updateTurnInDB = async (roomName, turn, playerName, playerID, move) => {
  try {
    await createTurn(roomName, turn, playerName, playerID, move);
  } catch (error) {
    console.error('Error creating turn:', error);
    throw error;
  }
};

/**
 * Creates a move handler function
 * @param {string} type - The type of move
 * @returns {Function} - Move handler function
 */
const createMoveHandler = (type) => {
  return (roomName, turn, playerName, activePlayerID, setConfirmed) => {
    return async () => {
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
export const all_moves = {
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
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {Function} setConfirmed - State setter for confirmed
 * @param {Function} setWaitingMessage - State setter for waiting message
 * @param {Function} setMove - State setter for move
 * @returns {Promise<void>}
 */
export const confirmTurn = async (roomName, turn, setConfirmed, setWaitingMessage, setMove) => {
  try {
    if (setConfirmed !== null) setConfirmed(true);
    if (setWaitingMessage !== null) setWaitingMessage('Waiting for others');
    if (setMove !== null) setMove('');
    await incrementConfirmations(roomName, turn);
  } catch (error) {
    console.error('Error confirming turn:', error);
  }
};
