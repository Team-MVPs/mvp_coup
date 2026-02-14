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
 * @param {Function} setPlayerID - State setter for player ID
 * @param {string} name - The player's name
 * @param {string} roomName - The room to join
 * @returns {Promise<void>}
 */
export const register = async (setPlayerID, name, roomName) => {
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
 * @param {string} roomName - The room name to check
 * @returns {Promise<boolean>} - True if room exists, false otherwise
 */
export const checkRoomNameExists = async (roomName) => {
  try {
    return await checkRoomExists(roomName);
  } catch (error) {
    console.error('Error checking room existence:', error);
    throw error;
  }
};

/**
 * Checks if the game has started in a room
 * @param {string} roomName - The room name to check
 * @returns {Promise<boolean>} - True if game has started, false otherwise
 */
export const checkGameStart = async (roomName) => {
  try {
    return await checkGameStarted(roomName);
  } catch (error) {
    console.error('Error checking game start:', error);
    throw error;
  }
};

/**
 * Checks if a player name already exists in a room
 * @param {string} roomName - The room name
 * @param {string} playerName - The player name to check
 * @returns {Promise<boolean>} - True if player name exists, false otherwise
 */
export const checkPlayerNameExists = async (roomName, playerName) => {
  try {
    return await checkPlayerExists(roomName, playerName);
  } catch (error) {
    console.error('Error checking player name existence:', error);
    throw error;
  }
};

/**
 * Creates a new room
 * @param {string} roomName - The name of the room to create
 * @returns {Promise<void>}
 */
export const createRoomName = async (roomName) => {
  try {
    await createRoom(roomName);
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Starts the game by distributing cards and updating game state
 * @param {string} roomName - The room name
 * @returns {Promise<void>}
 */
export const startGame = async (roomName) => {
  try {
    await distributeCards(roomName);
    await startGameApi(roomName);
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

