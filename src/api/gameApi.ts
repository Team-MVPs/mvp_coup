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
import { CharacterType } from '../types';

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Determines the number of cards per type based on room size
 * @param roomSize - Number of players in the room
 * @returns Number of cards per character type
 */
const getCardsPerType = (roomSize: number): number => {
  if (roomSize > LARGE_ROOM_THRESHOLD) {
    return CARDS_PER_TYPE_LARGE;
  } else if (roomSize > MEDIUM_ROOM_THRESHOLD) {
    return CARDS_PER_TYPE_MEDIUM;
  }
  return CARDS_PER_TYPE_SMALL;
};

/**
 * Distributes cards to all players and initializes the game
 * @param roomName - The name of the room
 * @returns Promise that resolves when distribution is complete
 */
export const distributeCards = async (roomName: string): Promise<void> => {
  try {
    const players = await getAllPlayers(roomName);
    const roomSize = players.length;
    const cardsPerType = getCardsPerType(roomSize);

    // Create and shuffle the deck
    let cards: CharacterType[] = [];
    ALL_CHARACTERS.forEach((char) => {
      for (let i = 0; i < cardsPerType; i++) {
        cards.push(char);
      }
    });
    cards = shuffleArray(cards);

    // Distribute cards to each player
    const roomRef = getRoomRef(roomName);
    for (const player of players) {
      const playerCards: CharacterType[] = [];
      for (let i = 0; i < INITIAL_CARDS_PER_PLAYER; i++) {
        const card = cards.pop();
        if (card) {
          playerCards.push(card);
        }
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
 * @param roomName - The name of the room
 * @param playerIndex - The player index to check
 * @returns True if player has cards, false otherwise
 */
export const playerAtIndexHasCards = async (roomName: string, playerIndex: number): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @param currentPlayerIndex - Current player index
 * @returns True if current player is the only one with cards
 */
export const checkForWinner = async (roomName: string, currentPlayerIndex: number): Promise<boolean> => {
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
 * @param roomName - The name of the room
 * @param totalPlayers - Total number of players
 * @param playerNames - Array of player names
 * @returns Promise that resolves when turn is incremented
 */
export const incrementTurn = async (roomName: string, totalPlayers: number, playerNames: string[]): Promise<void> => {
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
