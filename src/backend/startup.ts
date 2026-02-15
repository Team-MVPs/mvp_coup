/**
 * Startup and registration functions for room and player management
 */

import {
  createRoom,
  checkRoomExists,
  checkGameStarted,
  startGame as startGameApi,
} from '../api/roomApi';
import {
  registerPlayer,
  checkPlayerNameExists as checkPlayerExists,
} from '../api/playerApi';
import { distributeCards } from '../api/gameApi';

/**
 * Registers a new player in a room
 * param setPlayerID - State setter for player ID
 * param name - The player's name
 * param roomName - The room to join
 * returns Promise that resolves when player is registered
 */
export const register = async (
  setPlayerID: (id: string) => void,
  name: string,
  roomName: string
): Promise<void> => {
  try {
    const playerID = await registerPlayer(name, roomName);
    setPlayerID(playerID);
  } catch (error) {
    console.error('Error registering player:', error);
    throw error;
  }
};

/**
 * Checks if a room name exists
 * param roomName - The room name to check
 * returns True if room exists, false otherwise
 */
export const checkRoomNameExists = async (roomName: string): Promise<boolean> => {
  try {
    return await checkRoomExists(roomName);
  } catch (error) {
    console.error('Error checking room existence:', error);
    throw error;
  }
};

/**
 * Checks if the game has started in a room
 * param roomName - The room name to check
 * returns True if game has started, false otherwise
 */
export const checkGameStart = async (roomName: string): Promise<boolean> => {
  try {
    return await checkGameStarted(roomName);
  } catch (error) {
    console.error('Error checking game start:', error);
    throw error;
  }
};

/**
 * Checks if a player name already exists in a room
 * param roomName - The room name
 * param playerName - The player name to check
 * returns True if player name exists, false otherwise
 */
export const checkPlayerNameExists = async (roomName: string, playerName: string): Promise<boolean> => {
  try {
    return await checkPlayerExists(roomName, playerName);
  } catch (error) {
    console.error('Error checking player name existence:', error);
    throw error;
  }
};

/**
 * Creates a new room
 * param roomName - The name of the room to create
 * returns Promise that resolves when room is created
 */
export const createRoomName = async (roomName: string): Promise<void> => {
  try {
    await createRoom(roomName);
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Starts the game by distributing cards and updating game state
 * param roomName - The room name
 * returns Promise that resolves when game is started
 */
export const startGame = async (roomName: string): Promise<void> => {
  try {
    await distributeCards(roomName);
    await startGameApi(roomName);
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

