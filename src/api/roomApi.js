/**
 * Room-related API functions for Firebase operations
 */

import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION } from '../constants';

/**
 * Creates a new room in the database
 * @param {string} roomName - The name of the room to create
 * @returns {Promise<void>}
 */
export const createRoom = async (roomName) => {
  try {
    await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).set({
      startGame: false,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Checks if a room exists in the database
 * @param {string} roomName - The name of the room to check
 * @returns {Promise<boolean>} - True if room exists, false otherwise
 */
export const checkRoomExists = async (roomName) => {
  try {
    const doc = await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).get();
    return doc.exists;
  } catch (error) {
    console.error('Error checking room existence:', error);
    throw error;
  }
};

/**
 * Gets room data from the database
 * @param {string} roomName - The name of the room
 * @returns {Promise<Object>} - Room data
 */
export const getRoomData = async (roomName) => {
  try {
    const doc = await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).get();
    if (!doc.exists) {
      throw new Error(`Room ${roomName} does not exist`);
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting room data:', error);
    throw error;
  }
};

/**
 * Updates room data in the database
 * @param {string} roomName - The name of the room
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateRoom = async (roomName, data) => {
  try {
    await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).update(data);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

/**
 * Gets the room document reference
 * @param {string} roomName - The name of the room
 * @returns {DocumentReference} - Firebase document reference
 */
export const getRoomRef = (roomName) => {
  return firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName);
};

/**
 * Checks if the game has started in a room
 * @param {string} roomName - The name of the room
 * @returns {Promise<boolean>} - True if game has started, false otherwise
 */
export const checkGameStarted = async (roomName) => {
  try {
    const roomData = await getRoomData(roomName);
    return roomData.startGame || false;
  } catch (error) {
    console.error('Error checking game start status:', error);
    throw error;
  }
};

/**
 * Updates the card deck in the room
 * @param {string} roomName - The name of the room
 * @param {Array<string>} cards - Array of card names
 * @returns {Promise<void>}
 */
export const updateRoomCards = async (roomName, cards) => {
  try {
    await updateRoom(roomName, { cards });
  } catch (error) {
    console.error('Error updating room cards:', error);
    throw error;
  }
};

/**
 * Sets the winner of the game
 * @param {string} roomName - The name of the room
 * @param {string} winnerName - The name of the winner
 * @returns {Promise<void>}
 */
export const setWinner = async (roomName, winnerName) => {
  try {
    await updateRoom(roomName, { winner: winnerName });
  } catch (error) {
    console.error('Error setting winner:', error);
    throw error;
  }
};

/**
 * Increments the turn number in the room
 * @param {string} roomName - The name of the room
 * @param {number} nextTurn - The next turn number
 * @returns {Promise<void>}
 */
export const setTurn = async (roomName, nextTurn) => {
  try {
    await updateRoom(roomName, { turn: nextTurn });
  } catch (error) {
    console.error('Error setting turn:', error);
    throw error;
  }
};

/**
 * Starts the game in a room
 * @param {string} roomName - The name of the room
 * @returns {Promise<void>}
 */
export const startGame = async (roomName) => {
  try {
    await updateRoom(roomName, {
      startGame: true,
      turn: 0,
    });
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};
