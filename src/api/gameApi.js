/**
 * Game logic API functions for Firebase operations
 */

import { getRoomRef, getRoomData, setTurn, setWinner } from './roomApi';
import { getAllPlayers, initializePlayer } from './playerApi';
import {
  ALL_CHARACTERS,
  CARDS_PER_TYPE_SMALL,
  CARDS_PER_TYPE_MEDIUM,
  CARDS_PER_TYPE_LARGE,
  MEDIUM_ROOM_THRESHOLD,
  LARGE_ROOM_THRESHOLD,
  INITIAL_COINS_PER_PLAYER,
  INITIAL_CARDS_PER_PLAYER,
} from '../constants';

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Determines the number of cards per type based on room size
 * @param {number} roomSize - Number of players in the room
 * @returns {number} - Number of cards per character type
 */
const getCardsPerType = (roomSize) => {
  if (roomSize > LARGE_ROOM_THRESHOLD) {
    return CARDS_PER_TYPE_LARGE;
  } else if (roomSize > MEDIUM_ROOM_THRESHOLD) {
    return CARDS_PER_TYPE_MEDIUM;
  }
  return CARDS_PER_TYPE_SMALL;
};

/**
 * Distributes cards to all players and initializes the game
 * @param {string} roomName - The name of the room
 * @returns {Promise<void>}
 */
export const distributeCards = async (roomName) => {
  try {
    const players = await getAllPlayers(roomName);
    const roomSize = players.length;
    const cardsPerType = getCardsPerType(roomSize);

    // Create and shuffle the deck
    let cards = [];
    ALL_CHARACTERS.forEach((char) => {
      for (let i = 0; i < cardsPerType; i++) {
        cards.push(char);
      }
    });
    cards = shuffleArray(cards);

    // Distribute cards to each player
    const roomRef = getRoomRef(roomName);
    for (const player of players) {
      const playerCards = [];
      for (let i = 0; i < INITIAL_CARDS_PER_PLAYER; i++) {
        playerCards.push(cards.pop());
      }
      await initializePlayer(roomName, player.id, playerCards, INITIAL_COINS_PER_PLAYER);
    }

    // Store remaining cards in room
    await roomRef.update({ cards });
  } catch (error) {
    console.error('Error distributing cards:', error);
    throw error;
  }
};

/**
 * Checks if a specific player (by index) has cards
 * @param {string} roomName - The name of the room
 * @param {number} playerIndex - The player index to check
 * @returns {Promise<boolean>} - True if player has cards, false otherwise
 */
export const playerAtIndexHasCards = async (roomName, playerIndex) => {
  try {
    const players = await getAllPlayers(roomName);
    if (playerIndex >= players.length) {
      return false;
    }
    const player = players[playerIndex];
    return player.cards && player.cards.length > 0;
  } catch (error) {
    console.error('Error checking if player has cards:', error);
    throw error;
  }
};

/**
 * Checks if there is a winner (only one player has cards)
 * @param {string} roomName - The name of the room
 * @param {number} currentPlayerIndex - Current player index
 * @returns {Promise<boolean>} - True if current player is the only one with cards
 */
export const checkForWinner = async (roomName, currentPlayerIndex) => {
  try {
    const players = await getAllPlayers(roomName);
    let playersWithCards = 0;

    players.forEach((player, index) => {
      if (player.cards && player.cards.length > 0) {
        playersWithCards++;
        if (index !== currentPlayerIndex) {
          return false;
        }
      }
    });

    return playersWithCards === 1;
  } catch (error) {
    console.error('Error checking for winner:', error);
    throw error;
  }
};

/**
 * Increments the turn to the next player with cards
 * @param {string} roomName - The name of the room
 * @param {number} totalPlayers - Total number of players
 * @param {Array<string>} playerNames - Array of player names
 * @returns {Promise<void>}
 */
export const incrementTurn = async (roomName, totalPlayers, playerNames) => {
  try {
    const roomData = await getRoomData(roomName);
    let nextTurn = roomData.turn + 1;
    let winner = false;

    // Find next player with cards
    while (!(await playerAtIndexHasCards(roomName, nextTurn % totalPlayers))) {
      nextTurn += 1;

      // Check if we've looped back to the original player (winner scenario)
      if (nextTurn % totalPlayers === roomData.turn % totalPlayers) {
        winner = true;
        await setWinner(roomName, playerNames[nextTurn % totalPlayers]);
        break;
      }
    }

    // Check for winner if not already found
    if (!winner && (await checkForWinner(roomName, nextTurn % totalPlayers))) {
      await setWinner(roomName, playerNames[nextTurn % totalPlayers]);
    }

    // Update turn
    await setTurn(roomName, nextTurn);
  } catch (error) {
    console.error('Error incrementing turn:', error);
    throw error;
  }
};
