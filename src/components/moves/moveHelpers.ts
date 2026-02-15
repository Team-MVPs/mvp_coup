/**
 * Helper functions for move execution
 */

import { updatePlayerCoins, updatePlayerCards } from '../../api/playerApi';
import { getRoomData, updateRoomCards } from '../../api/roomApi';
import { getCardFromMove } from '../../utils/cardHelpers';
import {
  GENERAL_INCOME_AMOUNT,
  FOREIGN_AID_AMOUNT,
  DUKE_INCOME_AMOUNT,
  CAPTAIN_STEAL_AMOUNT,
} from '../../constants';

/**
 * Executes general income move (add 1 coin)
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @returns {Promise<void>}
 */
export const generalIncome = async (roomName, playerID) => {
  try {
    await updatePlayerCoins(roomName, playerID, GENERAL_INCOME_AMOUNT);
  } catch (error) {
    console.error('Error executing general income:', error);
    throw error;
  }
};

/**
 * Executes foreign aid move (add 2 coins)
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @returns {Promise<void>}
 */
export const foreignAid = async (roomName, playerID) => {
  try {
    await updatePlayerCoins(roomName, playerID, FOREIGN_AID_AMOUNT);
  } catch (error) {
    console.error('Error executing foreign aid:', error);
    throw error;
  }
};

/**
 * Executes Duke move (add 3 coins)
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @returns {Promise<void>}
 */
export const Duke = async (roomName, playerID) => {
  try {
    await updatePlayerCoins(roomName, playerID, DUKE_INCOME_AMOUNT);
  } catch (error) {
    console.error('Error executing Duke move:', error);
    throw error;
  }
};

/**
 * Deducts 2 coins from player (for losing steal bluff)
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @returns {Promise<void>}
 */
export const loseTwoCoins = async (roomName, playerID) => {
  try {
    await updatePlayerCoins(roomName, playerID, -CAPTAIN_STEAL_AMOUNT);
  } catch (error) {
    console.error('Error deducting coins:', error);
    throw error;
  }
};

/**
 * Exchanges one card with the deck
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {string} move - The move type
 * @returns {Promise<void>}
 */
export const exchangeOneCard = async (roomName, playerID, move) => {
  try {
    const card = getCardFromMove(move);
    const roomData = await getRoomData(roomName);
    const playerData = await import('../../api/playerApi').then(m => m.getPlayerData(roomName, playerID));

    // Get top card from deck
    const allCards = [...roomData.cards];
    const topCard = allCards.shift();
    allCards.push(card);

    // Update room cards
    await updateRoomCards(roomName, allCards);

    // Find which card to replace in player's hand
    const playerCards = [...playerData.cards];
    const playerCardIndex = playerCards[0] !== card ? 1 : 0;
    playerCards.splice(playerCardIndex, 1);
    playerCards.push(topCard);

    // Update player cards
    await updatePlayerCards(roomName, playerID, playerCards);
  } catch (error) {
    console.error('Error exchanging card:', error);
    throw error;
  }
};

/**
 * Checks if a player has a specific card
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player
 * @param {string} move - The move type
 * @returns {Promise<boolean>} - True if player has the card
 */
export const HasCard = async (roomName, playerID, move) => {
  try {
    const card = getCardFromMove(move);
    const { playerHasCard } = await import('../../api/playerApi');
    return await playerHasCard(roomName, playerID, card);
  } catch (error) {
    console.error('Error checking if player has card:', error);
    throw error;
  }
};
