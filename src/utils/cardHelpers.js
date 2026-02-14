/**
 * Card-related helper functions
 */

import { MOVE_TO_CARD_MAP } from '../constants';

/**
 * Gets the card name from a move type
 * @param {string} moveType - The type of move
 * @returns {string} - The card name associated with the move
 */
export const getCardFromMove = (moveType) => {
  const card = MOVE_TO_CARD_MAP[moveType];
  if (!card) {
    throw new Error(`Invalid move type: ${moveType}`);
  }
  return card;
};

/**
 * Updates card deck by removing chosen cards
 * @param {Array<Array>} cards - Array of [cardName, key] pairs
 * @param {Set} chosenKeys - Set of chosen card keys
 * @param {Array<string>} oldCards - Existing cards in deck
 * @returns {Array<string>} - Updated card deck
 */
export const updateCardDeck = (cards, chosenKeys, oldCards) => {
  const updatedDeck = [...oldCards];
  for (let i = 0; i < cards.length; i++) {
    if (!chosenKeys.has(cards[i][1])) {
      updatedDeck.push(cards[i][0]);
    }
  }
  return updatedDeck;
};

/**
 * Updates card deck by adding discarded cards (for bluff)
 * @param {Array<Array>} cards - Array of [cardName, key] pairs
 * @param {Set} chosenKeys - Set of chosen card keys
 * @param {Array<string>} oldCards - Existing cards in deck
 * @returns {Array<string>} - Updated card deck
 */
export const updateCardDeckBluff = (cards, chosenKeys, oldCards) => {
  const updatedDeck = [...oldCards];
  for (let i = 0; i < cards.length; i++) {
    if (chosenKeys.has(cards[i][1])) {
      updatedDeck.push(cards[i][0]);
    }
  }
  return updatedDeck;
};

/**
 * Converts player cards to viewable format with unique keys
 * @param {Array<string>} playerCards - Array of card names
 * @returns {Array<Array>} - Array of [cardName, key] pairs
 */
export const convertToViewableCards = (playerCards) => {
  return playerCards.map((card, index) => [card, index + 1]);
};
