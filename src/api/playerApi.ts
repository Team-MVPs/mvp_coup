/**
 * Player-related API functions for Firebase operations
 */

import firebase from 'firebase';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, PLAYERS_COLLECTION } from '../constants';
import { Player, CharacterType } from '../types';

/**
 * Registers a new player in a room
 * @param playerName - The name of the player
 * @param roomName - The name of the room
 * @returns The playerID of the newly created player
 */
export const registerPlayer = async (playerName: string, roomName: string): Promise<string> => {
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
 * @param roomName - The name of the room
 * @param playerName - The name of the player to check
 * @returns True if player exists, false otherwise
 */
export const checkPlayerNameExists = async (roomName: string, playerName: string): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @returns Player data
 */
export const getPlayerData = async (roomName: string, playerID: string): Promise<Player> => {
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
    return doc.data() as Player;
  } catch (error) {
    console.error('Error getting player data:', error);
    throw error;
  }
};

/**
 * Gets all players in a room
 * @param roomName - The name of the room
 * @returns Array of player documents with IDs
 */
export const getAllPlayers = async (roomName: string): Promise<Array<Player & { id: string }>> => {
  try {
    const snapshot = await firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Player),
    }));
  } catch (error) {
    console.error('Error getting all players:', error);
    throw error;
  }
};

/**
 * Gets the count of players with cards (still in game)
 * @param roomName - The name of the room
 * @returns Count of active players
 */
export const getActivePlayerCount = async (roomName: string): Promise<number> => {
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
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @param data - Data to update
 * @returns Promise that resolves when update is complete
 */
export const updatePlayer = async (roomName: string, playerID: string, data: Partial<Player>): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @param amount - Amount to increment (use negative for decrement)
 * @returns Promise that resolves when update is complete
 */
export const updatePlayerCoins = async (roomName: string, playerID: string, amount: number): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @param cards - New array of cards
 * @returns Promise that resolves when update is complete
 */
export const updatePlayerCards = async (roomName: string, playerID: string, cards: CharacterType[]): Promise<void> => {
  try {
    await updatePlayer(roomName, playerID, { cards });
  } catch (error) {
    console.error('Error updating player cards:', error);
    throw error;
  }
};

/**
 * Initializes player with cards and coins at game start
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @param cards - Initial cards for the player
 * @param coins - Initial coin amount
 * @returns Promise that resolves when initialization is complete
 */
export const initializePlayer = async (roomName: string, playerID: string, cards: CharacterType[], coins: number): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param playerID - The ID of the player
 * @param cardName - The name of the card to check
 * @returns True if player has the card, false otherwise
 */
export const playerHasCard = async (roomName: string, playerID: string, cardName: CharacterType): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @returns Firebase collection reference
 */
export const getPlayersCollectionRef = (roomName: string): firebase.firestore.CollectionReference => {
  return firestore
    .collection(FIREBASE_ROOT_COLLECTION)
    .doc(roomName)
    .collection(PLAYERS_COLLECTION);
};
