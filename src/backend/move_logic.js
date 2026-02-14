/**
 * Core move logic and game state machine for Coup
 * This file has been refactored to use modular helpers and the API layer
 */

// Import dependencies
import { getActivePlayerCount, updatePlayerCoins } from '../api/playerApi';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, TURNS_COLLECTION } from '../constants';
import {
  MOVE_GENERAL_INCOME,
  MOVE_COUP,
  MOVE_FOREIGN_AID,
  MOVE_DUKE,
  MOVE_EXCHANGE_CARDS,
  MOVE_ASSASSINATE,
  MOVE_STEAL,
} from '../constants/moveTypes';
import {
  COUP_COST,
  ASSASSINATE_COST,
  CAPTAIN_STEAL_AMOUNT,
} from '../constants/gameConstants';
import { CHAR_CONTESSA } from '../constants/characterTypes';
import {
  generalIncome,
  foreignAid,
  Duke,
  exchangeOneCard,
} from '../components/moves/moveHelpers';
import { incrementTurn as incrementTurnApi } from '../api/gameApi';
import { handleBluffLoser, handleBlockBluff, handlePlayerBluffed } from './move_logic_helpers';

// Re-export from move creators
export { Move, updateTurnInDB, all_moves, confirmTurn } from './move_creators';

// Re-export from move responses
export {
  responses,
  responsesForeignAid,
  responsesBlock,
  responsesAssassin,
  responsesCaptain,
  responsesDuke,
  responsesAmbassador,
} from './move_responses';

// Re-export incrementTurn from API
export { incrementTurn } from '../api/gameApi';

let registeredTurn = -1;

/**
 * Registers callbacks for move handling and game state updates
 * This is the main game state machine that handles all move logic
 */
export const RegisterMoveCallback = (
  roomName,
  turn,
  playerID,
  realPlayerName,
  setMove,
  setCurrentMove,
  setConfirmed,
  setWaitingMessage,
  setPlayerChosen,
  setLoseACard,
  setAmbassadorBluff,
  totalPlayers,
  playerNames
) => {
  getActivePlayerCount(roomName).then((numPlayers) => {
    let alreadyInvoked = false;
    let bluffDecided = false;
    let blockDecided = false;
    let takeCoins = false;
    let exchangeCard = false;
    let blocked = false;
    let makeMove = false;
    let incrementTurnFromPlayer = true;

    if (turn >= 0 && turn !== registeredTurn) {
      firestore
        .collection(FIREBASE_ROOT_COLLECTION)
        .doc(roomName)
        .collection(TURNS_COLLECTION)
        .doc(turn.toString())
        .onSnapshot(async (doc) => {
          if (doc.exists) {
            const turnData = doc.data();
            let move = turnData.move.type;
            const playerName = turnData.playerName;
            const targetPlayer = turnData.move.to;
            const ambassadorBluffDoc = turnData.ambassadorBluff;

            // Handle moves from other players
            if (turnData.playerID !== playerID) {
              // Initial move announcement
              if (!alreadyInvoked && move !== MOVE_GENERAL_INCOME && move !== MOVE_COUP) {
                const moveLabel = move === MOVE_EXCHANGE_CARDS ? 'Ambassador' : move;
                setMove(`${playerName} performed ${moveLabel}`);
                alreadyInvoked = true;

                if (move === MOVE_ASSASSINATE) {
                  setCurrentMove('AttemptAssassin');
                  setWaitingMessage('Waiting for assassin to strike! Quick, try and hide!');
                } else if (move === MOVE_STEAL) {
                  setCurrentMove('Captain');
                  setWaitingMessage('Player is waiting to choose from whom to steal');
                } else if (move === MOVE_FOREIGN_AID) {
                  setCurrentMove('ForeignAid');
                  setConfirmed(false);
                } else if (move === MOVE_DUKE) {
                  setCurrentMove('Duke');
                  setConfirmed(false);
                } else if (move === MOVE_EXCHANGE_CARDS) {
                  setCurrentMove('Ambassador');
                }
              } else {
                if (move === MOVE_COUP) {
                  setMove(`${playerName} performed ${move}`);
                  setCurrentMove('Coup');
                  setWaitingMessage('A Coup has been launched! Start Praying!');
                  if (targetPlayer !== null) {
                    setPlayerChosen(targetPlayer);
                    setLoseACard(true);
                  }
                } else if (move === MOVE_ASSASSINATE) {
                  if (targetPlayer !== null) {
                    setPlayerChosen(targetPlayer);
                  }
                  if (turnData.confirmations === 1) {
                    setLoseACard(true);
                    const message =
                      targetPlayer === realPlayerName
                        ? 'You have been Assassinated! Choose one card to lose!'
                        : `The Assassin has struck! ${targetPlayer} will lose a card!`;
                    setWaitingMessage(message);
                  }
                } else if (move === MOVE_STEAL) {
                  if (targetPlayer !== null) {
                    setPlayerChosen(targetPlayer);
                  }
                  if (turnData.confirmations === 1 && targetPlayer === realPlayerName) {
                    if (!takeCoins) {
                      await updatePlayerCoins(roomName, playerID, -CAPTAIN_STEAL_AMOUNT);
                      takeCoins = true;
                    }
                  }
                }

                // Handle bluff results
                if (turnData.bluffLoser !== undefined && !bluffDecided) {
                  bluffDecided = true;
                  await handleBluffLoser(
                    turnData,
                    playerID,
                    move,
                    roomName,
                    totalPlayers,
                    playerNames,
                    setWaitingMessage,
                    setMove,
                    setConfirmed
                  );
                }
                // Handle block bluffs
                else if (turnData.blocks.length !== 0) {
                  await handleBlockBluff(
                    turnData,
                    playerID,
                    playerName,
                    move,
                    roomName,
                    { blockDecided, exchangeCard },
                    setWaitingMessage,
                    setConfirmed
                  );
                }
              }
            }
            // Handle moves from current player
            else {
              // Handle bluffs against current player's move
              if (turnData.bluffs.length !== 0 && !bluffDecided) {
                await handlePlayerBluffed(
                  turnData,
                  move,
                  roomName,
                  playerID,
                  realPlayerName,
                  turn,
                  { bluffDecided, incrementTurnFromPlayer, makeMove, exchangeCard },
                  setWaitingMessage,
                  setConfirmed,
                  setMove
                );
              }
              // Handle blocks against current player's move
              else if (turnData.blocks.length !== 0) {
                setLoseACard(true);
                setConfirmed(false);
                setCurrentMove('blocked');
                blocked = true;

                if (turnData.blocks[0] !== undefined) {
                  const blockCard = turnData.blocks[0].card;
                  let message = `${targetPlayer} blocked your move as ${blockCard}. Pick one!`;
                  if (move === MOVE_ASSASSINATE && blockCard !== CHAR_CONTESSA) {
                    message = `${targetPlayer} blocked your move as Contessa. Pick one!`;
                  } else if (blockCard === 'Duke') {
                    message = `${turnData.blocks[0].playerName} blocked your move as Duke. Pick one!`;
                  }
                  setWaitingMessage(message);
                }

                incrementTurnFromPlayer = turnData.blocks[0].letGo;
              }

              // Execute moves based on type
              switch (move) {
                case MOVE_GENERAL_INCOME:
                  setConfirmed(false);
                  await generalIncome(roomName, playerID);
                  await incrementTurnApi(roomName, totalPlayers, playerNames);
                  break;

                case MOVE_COUP:
                  setConfirmed(false);
                  if (!takeCoins) {
                    await updatePlayerCoins(roomName, playerID, -COUP_COST);
                    takeCoins = true;
                  }
                  setCurrentMove('Coup');
                  if (targetPlayer !== null) {
                    setLoseACard(true);
                    setWaitingMessage(`You have launched a Coup! ${targetPlayer} will now lose a card!`);
                  }
                  break;

                case MOVE_EXCHANGE_CARDS:
                  if (turnData.confirmations + 1 === numPlayers || makeMove) {
                    if (exchangeCard) {
                      setAmbassadorBluff(true);
                      exchangeCard = false;
                      await exchangeOneCard(roomName, playerID, move);
                      setConfirmed(false);
                      setCurrentMove('Ambassador');
                    } else {
                      setConfirmed(false);
                      if (!ambassadorBluffDoc) {
                        setCurrentMove('Ambassador');
                      }
                    }
                  }
                  break;

                case MOVE_ASSASSINATE:
                  if (!takeCoins) {
                    await updatePlayerCoins(roomName, playerID, -ASSASSINATE_COST);
                    takeCoins = true;
                  }
                  if (!blocked) {
                    setCurrentMove('AttemptAssassin');
                  }
                  if (turnData.confirmations === 1) {
                    setLoseACard(true);
                    setWaitingMessage(`Your Assassin has struck! ${targetPlayer} will lose a card!`);
                  }
                  if (incrementTurnFromPlayer && blocked) {
                    await incrementTurnApi(roomName, totalPlayers, playerNames);
                  }
                  break;

                case MOVE_STEAL:
                  if (!blocked) {
                    setCurrentMove('Captain');
                  }
                  if (targetPlayer !== null) {
                    setPlayerChosen(targetPlayer);
                  }
                  if (turnData.confirmations === 1 || makeMove) {
                    if (!takeCoins) {
                      await updatePlayerCoins(roomName, playerID, CAPTAIN_STEAL_AMOUNT);
                      takeCoins = true;
                    }
                    if (incrementTurnFromPlayer) {
                      await incrementTurnApi(roomName, totalPlayers, playerNames);
                    }
                  } else if (incrementTurnFromPlayer && blocked) {
                    await incrementTurnApi(roomName, totalPlayers, playerNames);
                  }
                  break;

                case MOVE_FOREIGN_AID:
                  if ((turnData.confirmations + 1 === numPlayers && !blocked) || makeMove) {
                    await foreignAid(roomName, playerID);
                    if (incrementTurnFromPlayer) {
                      await incrementTurnApi(roomName, totalPlayers, playerNames);
                    }
                  }
                  if (incrementTurnFromPlayer && blocked) {
                    await incrementTurnApi(roomName, totalPlayers, playerNames);
                  }
                  break;

                case MOVE_DUKE:
                  if (turnData.confirmations + 1 === numPlayers || makeMove) {
                    await Duke(roomName, playerID);
                    makeMove = false;
                    if (incrementTurnFromPlayer) {
                      await incrementTurnApi(roomName, totalPlayers, playerNames);
                    }
                  }
                  break;

                default:
                  break;
              }
            }

            // Handle card exchange after bluff
            if (exchangeCard && move !== '') {
              let cardToExchange = move;
              if (turnData.blocks.length !== 0 && move === MOVE_ASSASSINATE) {
                cardToExchange = CHAR_CONTESSA;
              }
              await exchangeOneCard(roomName, playerID, cardToExchange);
              exchangeCard = false;
            }
          }
        });
      registeredTurn = turn;
    }
  });
};
