/**
 * Card-related helper functions
 */

import { MOVE_TO_CARD_MAP } from '../constants';
import { CharacterType, MoveType } from '../types';

/**
 * Gets the card name from a move type
 * @param moveType - The type of move
 * @returns The card name associated with the move
 */
export const getCardFromMove = (moveType: string): CharacterType => {
  const card = MOVE_TO_CARD_MAP[moveType];
  if (!card) {
    throw new Error(`Invalid move type: ${moveType}`);
  }
  return card;
};

/**
 * Updates card deck by removing chosen cards
 * @param cards - Array of [cardName, key] pairs
 * @param chosenKeys - Set of chosen card keys
 * @param oldCards - Existing cards in deck
 * @returns Updated card deck
 */
export const updateCardDeck = (
  cards: [CharacterType, number][],
  chosenKeys: Set<number>,
  oldCards: CharacterType[]
): CharacterType[] => {
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
 * @param cards - Array of [cardName, key] pairs
 * @param chosenKeys - Set of chosen card keys
 * @param oldCards - Existing cards in deck
 * @returns Updated card deck
 */
export const updateCardDeckBluff = (
  cards: [CharacterType, number][],
  chosenKeys: Set<number>,
  oldCards: CharacterType[]
): CharacterType[] => {
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
 * @param playerCards - Array of card names
 * @returns Array of [cardName, key] pairs
 */
export const convertToViewableCards = (
  playerCards: CharacterType[]
): [CharacterType, number][] => {
  return playerCards.map((card, index) => [card, index + 1]);
};
