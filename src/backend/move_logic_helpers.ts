/**
 * Helper functions for move logic
 */

import { setBluffLoser } from '../api/turnApi';
import { updatePlayerCards } from '../api/playerApi';
import { incrementTurn as incrementTurnApi } from '../api/gameApi';
import { loseTwoCoins, HasCard } from '../components/moves/moveHelpers';
import { MOVE_STEAL, MOVE_ASSASSINATE, MOVE_FOREIGN_AID, MOVE_EXCHANGE_CARDS } from '../constants/moveTypes';
import { Turn, MoveType, CharacterType } from '../types';

/**
 * Handles when a player loses a bluff
 */
export const handleBluffLoser = async (
  turnData: Turn,
  playerID: string,
  move: MoveType,
  roomName: string,
  totalPlayers: number,
  playerNames: string[],
  setWaitingMessage: (value: string) => void,
  setMove: (value: string) => void,
  setConfirmed: (value: boolean) => void
): Promise<void> => {
  if (turnData.bluffLoser && turnData.bluffLoser.playerID === playerID) {
    if (move === MOVE_STEAL) {
      await loseTwoCoins(roomName, playerID);
    }
    if (move === MOVE_ASSASSINATE) {
      await updatePlayerCards(roomName, playerID, []);
      await incrementTurnApi(roomName, totalPlayers, playerNames);
    } else {
      setWaitingMessage('Unsuccessful Bluff. Pick 1 card to lose');
      setMove('bluff');
    }
  } else if (turnData.bluffLoser) {
    const loser = turnData.bluffLoser.playerName;
    if (turnData.bluffs[0].playerID === playerID) {
      setWaitingMessage(`Successful Bluff! ${loser} is losing a card.`);
    } else {
      setWaitingMessage(`${loser} is losing a card on a failed bluff call`);
    }
    setConfirmed(true);
    setMove('');
  }
};

/**
 * Handles block bluff scenarios
 */
export const handleBlockBluff = async (
  turnData: Turn,
  playerID: string,
  playerName: string,
  move: MoveType,
  roomName: string,
  flags: {
    blockDecided: boolean;
    exchangeCard: boolean;
    [key: string]: any;
  },
  setWaitingMessage: (value: string) => void,
  setConfirmed: (value: boolean) => void
): Promise<void> => {
  if (
    turnData.bluffs.length !== 0 &&
    !flags.blockDecided &&
    turnData.blocks[0].playerID === playerID
  ) {
    flags.blockDecided = true;
    let blockedCardMove = '';

    switch (move) {
      case MOVE_FOREIGN_AID:
        blockedCardMove = 'duke';
        break;
      case MOVE_ASSASSINATE:
        blockedCardMove = 'Contessa';
        break;
      case MOVE_STEAL:
        blockedCardMove =
          turnData.blocks[0].card === 'Ambassador' ? MOVE_EXCHANGE_CARDS : MOVE_STEAL;
        break;
      default:
        break;
    }

    const result = await HasCard(roomName, playerID, blockedCardMove);
    if (result) {
      setWaitingMessage('You were bluffed but they were wrong');
      setConfirmed(true);
      flags.exchangeCard = true;
      await setBluffLoser(roomName, parseInt(turnData.turn), turnData.bluffs[0]);
    } else {
      await setBluffLoser(roomName, parseInt(turnData.turn), {
        playerID,
        playerName,
      });
    }
  }
};

/**
 * Handles when the current player is bluffed
 */
export const handlePlayerBluffed = async (
  turnData: Turn,
  move: MoveType,
  roomName: string,
  playerID: string,
  realPlayerName: string,
  turn: number,
  flags: {
    bluffDecided: boolean;
    makeMove: boolean;
    incrementTurnFromPlayer: boolean;
    exchangeCard: boolean;
    [key: string]: any;
  },
  setWaitingMessage: (value: string) => void,
  setConfirmed: (value: boolean) => void,
  setMove: (value: string) => void
): Promise<void> => {
  if (turnData.blocks.length === 0) {
    const result = await HasCard(roomName, playerID, move);
    flags.bluffDecided = true;

    if (result) {
      const bluffer = turnData.bluffs[0].playerName;
      setWaitingMessage(`${bluffer} bluffed your move. ${bluffer} is losing a card`);
      const isAmbassador = move === MOVE_EXCHANGE_CARDS;
      await setBluffLoser(roomName, turn, turnData.bluffs[0]);

      // Update ambassador bluff flag
      const { setAmbassadorBluff } = await import('../api/turnApi');
      await setAmbassadorBluff(roomName, turn, isAmbassador);

      flags.makeMove = true;
      flags.incrementTurnFromPlayer = false;
      setConfirmed(true);
      flags.exchangeCard = true;
    } else {
      await setBluffLoser(roomName, turn, { playerID, playerName: realPlayerName });
      setConfirmed(false);
      setMove('bluff');
      setWaitingMessage(`${turnData.bluffs[0].playerName} called Bluff. Pick 1 card to lose`);
    }
  } else {
    if (turnData.bluffLoser !== undefined) {
      flags.bluffDecided = true;
      if (turnData.bluffLoser.playerID === playerID) {
        setWaitingMessage('Unsuccessful Bluff. Pick 1 card to lose');
        setConfirmed(false);
        setMove('bluff');
        flags.incrementTurnFromPlayer = false;
      } else {
        setWaitingMessage('Gottem');
        flags.incrementTurnFromPlayer = false;
        flags.makeMove = true;
      }
    }
  }
};
