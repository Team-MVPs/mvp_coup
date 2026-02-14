/**
 * Player-related API functions for Firebase operations
 */

import firebase from 'firebase';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, PLAYERS_COLLECTION } from '../constants';

/**
 * Registers a new player in a room
 * @param {string} playerName - The name of the player
 * @param {string} roomName - The name of the room
 * @returns {Promise<string>} - The playerID of the newly created player
 */
export const registerPlayer = async (playerName, roomName) => {
  try {
    const docRef = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .add({
        name: playerName,
      });
    return docRef.id;
  } catch (error) {
    console.error('Error registering player:', error);
    throw error;
  }
};

/**
 * Checks if a player name already exists in a room
 * @param {string} roomName - The name of the room
 * @param {string} playerName - The name of the player to check
 * @returns {Promise<boolean>} - True if player exists, false otherwise
 */
export const checkPlayerNameExists = async (roomName, playerName) => {
  try {
    const snapshot = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .get();

    for (const doc of snapshot.docs) {
      if (doc.data().name === playerName) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking player name existence:', error);
    throw error;
  }
};

/**
 * Gets player data from the database
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @returns {Promise<Object>} - Player data
 */
export const getPlayerData = async (roomName, playerID) => {
  try {
    const doc = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .doc(playerID)
      .get();

    if (!doc.exists) {
      throw new Error(`Player ${playerID} does not exist`);
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting player data:', error);
    throw error;
  }
};

/**
 * Gets all players in a room
 * @param {string} roomName - The name of the room
 * @returns {Promise<Array<Object>>} - Array of player documents
 */
export const getAllPlayers = async (roomName) => {
  try {
    const snapshot = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting all players:', error);
    throw error;
  }
};

/**
 * Gets the count of players with cards (still in game)
 * @param {string} roomName - The name of the room
 * @returns {Promise<number>} - Count of active players
 */
export const getActivePlayerCount = async (roomName) => {
  try {
    const snapshot = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .get();

    let count = 0;
    snapshot.forEach((doc) => {
      if (doc.data().cards && doc.data().cards.length > 0) {
        count++;
      }
    });
    return count;
  } catch (error) {
    console.error('Error getting active player count:', error);
    throw error;
  }
};

/**
 * Updates player data in the database
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updatePlayer = async (roomName, playerID, data) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .doc(playerID)
      .update(data);
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

/**
 * Updates player's coins
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {number} amount - Amount to increment (use negative for decrement)
 * @returns {Promise<void>}
 */
export const updatePlayerCoins = async (roomName, playerID, amount) => {
  try {
    await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .doc(playerID)
      .update({
        coins: firebase.firestore.FieldValue.increment(amount),
      });
  } catch (error) {
    console.error('Error updating player coins:', error);
    throw error;
  }
};

/**
 * Updates player's cards
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {Array<string>} cards - New array of cards
 * @returns {Promise<void>}
 */
export const updatePlayerCards = async (roomName, playerID, cards) => {
  try {
    await updatePlayer(roomName, playerID, { cards });
  } catch (error) {
    console.error('Error updating player cards:', error);
    throw error;
  }
};

/**
 * Initializes player with cards and coins at game start
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {Array<string>} cards - Initial cards for the player
 * @param {number} coins - Initial coin amount
 * @returns {Promise<void>}
 */
export const initializePlayer = async (roomName, playerID, cards, coins) => {
  try {
    await updatePlayer(roomName, playerID, {
      cards,
      coins,
      inGame: true,
    });
  } catch (error) {
    console.error('Error initializing player:', error);
    throw error;
  }
};

/**
 * Checks if a player has a specific card
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {string} cardName - The name of the card to check
 * @returns {Promise<boolean>} - True if player has the card, false otherwise
 */
export const playerHasCard = async (roomName, playerID, cardName) => {
  try {
    const playerData = await getPlayerData(roomName, playerID);
    const cardSet = new Set(playerData.cards || []);
    return cardSet.has(cardName);
  } catch (error) {
    console.error('Error checking if player has card:', error);
    throw error;
  }
};

/**
 * Gets players collection reference
 * @param {string} roomName - The name of the room
 * @returns {CollectionReference} - Firebase collection reference
 */
export const getPlayersCollectionRef = (roomName) => {
  return firestore
    .collection(FIREBASE_ROOT_COLLECTION)
    .doc(roomName)
    .collection(PLAYERS_COLLECTION);
};
