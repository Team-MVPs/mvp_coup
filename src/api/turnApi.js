/**
 * Turn-related API functions for Firebase operations
 */

import firebase from 'firebase';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, TURNS_COLLECTION } from '../constants';

/**
 * Creates a new turn document in the database
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {string} playerName - The name of the player making the move
 * @param {string} playerID - The ID of the player making the move
 * @param {Object} move - The move object {type, player, to}
 * @returns {Promise<void>}
 */
export const createTurn = async (roomName, turn, playerName, playerID, move) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .set({
        turn,
        playerName,
        playerID,
        move,
        confirmations: 0,
        blocks: [],
        bluffs: [],
        ambassadorBluff: false,
      });
  } catch (error) {
    console.error('Error creating turn:', error);
    throw error;
  }
};

/**
 * Gets turn data from the database
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @returns {Promise<Object>} - Turn data
 */
export const getTurnData = async (roomName, turn) => {
  try {
    const doc = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .get();

    if (!doc.exists) {
      throw new Error(`Turn ${turn} does not exist`);
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting turn data:', error);
    throw error;
  }
};

/**
 * Updates turn data in the database
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateTurn = async (roomName, turn, data) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .update(data);
  } catch (error) {
    console.error('Error updating turn:', error);
    throw error;
  }
};

/**
 * Increments the confirmation count for a turn
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @returns {Promise<void>}
 */
export const incrementConfirmations = async (roomName, turn) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .update({
        confirmations: firebase.firestore.FieldValue.increment(1),
      });
  } catch (error) {
    console.error('Error incrementing confirmations:', error);
    throw error;
  }
};

/**
 * Adds a bluff to the turn
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {string} playerID - The ID of the player calling bluff
 * @param {string} playerName - The name of the player calling bluff
 * @returns {Promise<void>}
 */
export const addBluff = async (roomName, turn, playerID, playerName) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .update({
        bluffs: firebase.firestore.FieldValue.arrayUnion({ playerID, playerName }),
      });
  } catch (error) {
    console.error('Error adding bluff:', error);
    throw error;
  }
};

/**
 * Adds a block to the turn
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {string} playerID - The ID of the player blocking
 * @param {string} playerName - The name of the player blocking
 * @param {string} card - The card used to block
 * @returns {Promise<void>}
 */
export const addBlock = async (roomName, turn, playerID, playerName, card) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turn.toString())
      .update({
        blocks: firebase.firestore.FieldValue.arrayUnion({
          playerID,
          playerName,
          letGo: false,
          card,
        }),
      });
  } catch (error) {
    console.error('Error adding block:', error);
    throw error;
  }
};

/**
 * Sets the bluff loser for a turn
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {Object} loser - Object with playerID and playerName
 * @returns {Promise<void>}
 */
export const setBluffLoser = async (roomName, turn, loser) => {
  try {
    await updateTurn(roomName, turn, { bluffLoser: loser });
  } catch (error) {
    console.error('Error setting bluff loser:', error);
    throw error;
  }
};

/**
 * Updates the move in a turn (typically to add target player)
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {Object} move - The updated move object
 * @returns {Promise<void>}
 */
export const updateTurnMove = async (roomName, turn, move) => {
  try {
    await updateTurn(roomName, turn, { move });
  } catch (error) {
    console.error('Error updating turn move:', error);
    throw error;
  }
};

/**
 * Updates the block with letGo flag
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {Object} blockInfo - Updated block information
 * @returns {Promise<void>}
 */
export const updateBlockLetGo = async (roomName, turn, blockInfo) => {
  try {
    await updateTurn(roomName, turn, { blocks: [blockInfo] });
  } catch (error) {
    console.error('Error updating block letGo:', error);
    throw error;
  }
};

/**
 * Sets the ambassador bluff flag
 * @param {string} roomName - The name of the room
 * @param {number} turn - The turn number
 * @param {boolean} isAmbassadorBluff - Whether this is an ambassador bluff
 * @returns {Promise<void>}
 */
export const setAmbassadorBluff = async (roomName, turn, isAmbassadorBluff) => {
  try {
    await updateTurn(roomName, turn, { ambassadorBluff: isAmbassadorBluff });
  } catch (error) {
    console.error('Error setting ambassador bluff:', error);
    throw error;
  }
};
