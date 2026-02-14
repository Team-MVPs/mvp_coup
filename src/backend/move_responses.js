/**
 * Response handler functions for player actions (confirm, bluff, block)
 */

import { incrementConfirmations, addBluff, addBlock, updateBlockLetGo, getTurnData } from '../api/turnApi';
import { CHAR_DUKE, CHAR_CONTESSA, CHAR_CAPTAIN, CHAR_AMBASSADOR } from '../constants/characterTypes';

/**
 * Creates a response handler function
 * @param {string} type - The type of response (confirm, call_bluff, block, etc.)
 * @param {string} card - The card used for blocking (optional)
 * @returns {Function} - Response handler function
 */
const createRespond = (type, card) => {
  return (roomName, turn, playerName, playerID, setConfirmed, setMove) => {
    return async () => {
      try {
        switch (type) {
          case 'confirm':
            await incrementConfirmations(roomName, turn);
            setConfirmed(true);
            break;

          case 'call_bluff':
            await addBluff(roomName, turn, playerID, playerName);
            setConfirmed(true);
            break;

          case 'block':
            await addBlock(roomName, turn, playerID, playerName, card);
            setConfirmed(true);
            break;

          case 'blockAsCAP':
            await addBlock(roomName, turn, playerID, playerName, CHAR_CAPTAIN);
            setConfirmed(true);
            break;

          case 'blockAsAM':
            await addBlock(roomName, turn, playerID, playerName, CHAR_AMBASSADOR);
            setConfirmed(true);
            break;

          default:
            alert('Invalid response');
            break;
        }
      } catch (error) {
        console.error('Error handling response:', error);
      }
    };
  };
};

/**
 * Creates a block response handler function
 * @param {string} type - The type of block response (letGo, bluff)
 * @returns {Function} - Block response handler function
 */
const createRespondBlock = (type) => {
  return (roomName, turn, playerName, playerID, setConfirmed) => {
    return async () => {
      try {
        switch (type) {
          case 'letGo': {
            const turnData = await getTurnData(roomName, turn);
            const playerInfo = { ...turnData.blocks[0], letGo: true };
            await updateBlockLetGo(roomName, turn, playerInfo);
            break;
          }

          case 'bluff':
            await addBluff(roomName, turn, playerID, playerName);
            setConfirmed(true);
            break;

          default:
            alert('Invalid response');
            break;
        }
      } catch (error) {
        console.error('Error handling block response:', error);
      }
    };
  };
};

/**
 * Response options for general moves
 */
export const responses = {
  Confirm: createRespond('confirm'),
  'Call Bluff': createRespond('call_bluff'),
  Block: createRespond('block'),
};

/**
 * Response options for foreign aid
 */
export const responsesForeignAid = {
  Confirm: createRespond('confirm'),
  'Block as Duke': createRespond('block', CHAR_DUKE),
};

/**
 * Response options when blocked
 */
export const responsesBlock = {
  'Let Go': createRespondBlock('letGo'),
  'Call Bluff': createRespondBlock('bluff'),
};

/**
 * Response options for assassin move
 */
export const responsesAssassin = {
  Confirm: createRespond('confirm'),
  'Call Bluff': createRespond('call_bluff'),
  'Block as Contessa': createRespond('block', CHAR_CONTESSA),
};

/**
 * Response options for captain move
 */
export const responsesCaptain = {
  Confirm: createRespond('confirm'),
  'Call Bluff': createRespond('call_bluff'),
  'Block as Captain': createRespond('blockAsCAP'),
  'Block as Ambassador': createRespond('blockAsAM'),
};

/**
 * Response options for Duke move
 */
export const responsesDuke = {
  Confirm: createRespond('confirm'),
  'Call Bluff': createRespond('call_bluff'),
};

/**
 * Response options for Ambassador move
 */
export const responsesAmbassador = {
  Confirm: createRespond('confirm'),
  'Call Bluff': createRespond('call_bluff'),
};
