/**
 * Room-related API functions for Firebase operations
 */

import firebase from 'firebase';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION } from '../constants';
import { Room, CharacterType } from '../types';

/**
 * Creates a new room in the database
 * @param roomName - The name of the room to create
 */
export const createRoom = async (roomName: string): Promise<void> => {
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
 * @param roomName - The name of the room to check
 * @returns True if room exists, false otherwise
 */
export const checkRoomExists = async (roomName: string): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @returns Room data
 */
export const getRoomData = async (roomName: string): Promise<Room> => {
  try {
    const doc = await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).get();
    if (!doc.exists) {
      throw new Error(`Room ${roomName} does not exist`);
    }
    return doc.data() as Room;
  } catch (error) {
    console.error('Error getting room data:', error);
    throw error;
  }
};

/**
 * Updates room data in the database
 * @param roomName - The name of the room
 * @param data - Data to update
 */
export const updateRoom = async (roomName: string, data: Partial<Room>): Promise<void> => {
  try {
    await firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName).update(data);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

/**
 * Gets the room document reference
 * @param roomName - The name of the room
 * @returns Firebase document reference
 */
export const getRoomRef = (roomName: string): firebase.firestore.DocumentReference => {
  return firestore.collection(FIREBASE_ROOT_COLLECTION).doc(roomName);
};

/**
 * Checks if the game has started in a room
 * @param roomName - The name of the room
 * @returns True if game has started, false otherwise
 */
export const checkGameStarted = async (roomName: string): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @param cards - Array of card names
 */
export const updateRoomCards = async (roomName: string, cards: CharacterType[]): Promise<void> => {
  try {
    await updateRoom(roomName, { cards });
  } catch (error) {
    console.error('Error updating room cards:', error);
    throw error;
  }
};

/**
 * Sets the winner of the game
 * @param roomName - The name of the room
 * @param winnerName - The name of the winner
 */
export const setWinner = async (roomName: string, winnerName: string): Promise<void> => {
  try {
    await updateRoom(roomName, { winner: winnerName });
  } catch (error) {
    console.error('Error setting winner:', error);
    throw error;
  }
};

/**
 * Increments the turn number in the room
 * @param roomName - The name of the room
 * @param nextTurn - The next turn number
 */
export const setTurn = async (roomName: string, nextTurn: number): Promise<void> => {
  try {
    await updateRoom(roomName, { turn: nextTurn });
  } catch (error) {
    console.error('Error setting turn:', error);
    throw error;
  }
};

/**
 * Starts the game in a room
 * @param roomName - The name of the room
 */
export const startGame = async (roomName: string): Promise<void> => {
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
