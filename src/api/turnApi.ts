/**
 * Turn-related API functions for Firebase operations
 */

import firebase from 'firebase';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, TURNS_COLLECTION } from '../constants';
import { Turn, Move, Block, Bluff } from '../types';

/**
 * Creates a new turn document in the database
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param playerName - The name of the player making the move
 * @param playerID - The ID of the player making the move
 * @param move - The move object
 */
export const createTurn = async (
  roomName: string,
  turn: number,
  playerName: string,
  playerID: string,
  move: Move
): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @returns Turn data
 */
export const getTurnData = async (roomName: string, turn: number): Promise<Turn> => {
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
    return doc.data() as Turn;
  } catch (error) {
    console.error('Error getting turn data:', error);
    throw error;
  }
};

/**
 * Updates turn data in the database
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param data - Data to update
 */
export const updateTurn = async (roomName: string, turn: number, data: Partial<Turn>): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param turn - The turn number
 */
export const incrementConfirmations = async (roomName: string, turn: number): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param playerID - The ID of the player calling bluff
 * @param playerName - The name of the player calling bluff
 */
export const addBluff = async (
  roomName: string,
  turn: number,
  playerID: string,
  playerName: string
): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param playerID - The ID of the player blocking
 * @param playerName - The name of the player blocking
 * @param card - The card used to block
 */
export const addBlock = async (
  roomName: string,
  turn: number,
  playerID: string,
  playerName: string,
  card: string
): Promise<void> => {
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
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param loser - Object with playerID and playerName
 */
export const setBluffLoser = async (
  roomName: string,
  turn: number,
  loser: { playerID: string; playerName: string }
): Promise<void> => {
  try {
    await updateTurn(roomName, turn, { bluffLoser: loser } as Partial<Turn>);
  } catch (error) {
    console.error('Error setting bluff loser:', error);
    throw error;
  }
};

/**
 * Updates the move in a turn (typically to add target player)
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param move - The updated move object
 */
export const updateTurnMove = async (roomName: string, turn: number, move: Move): Promise<void> => {
  try {
    await updateTurn(roomName, turn, { move });
  } catch (error) {
    console.error('Error updating turn move:', error);
    throw error;
  }
};

/**
 * Updates the block with letGo flag
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param blockInfo - Updated block information
 */
export const updateBlockLetGo = async (roomName: string, turn: number, blockInfo: Block): Promise<void> => {
  try {
    await updateTurn(roomName, turn, { blocks: [blockInfo] });
  } catch (error) {
    console.error('Error updating block letGo:', error);
    throw error;
  }
};

/**
 * Sets the ambassador bluff flag
 * @param roomName - The name of the room
 * @param turn - The turn number
 * @param isAmbassadorBluff - Whether this is an ambassador bluff
 */
export const setAmbassadorBluff = async (
  roomName: string,
  turn: number,
  isAmbassadorBluff: boolean
): Promise<void> => {
  try {
    await updateTurn(roomName, turn, { ambassadorBluff: isAmbassadorBluff });
  } catch (error) {
    console.error('Error setting ambassador bluff:', error);
    throw error;
  }
};
