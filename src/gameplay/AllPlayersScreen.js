/**
 * Main gameplay screen component (refactored)
 * Handles all game states and player interactions
 */

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { MoveList } from '../components/MoveList';
import { RegisterMoveCallback, incrementTurn } from '../backend/move_logic';
import { RoomContext } from '../contexts/RoomContext';
import { usePlayerData, useRoomData } from '../hooks';
import OtherMoves from '../components/OtherMoves';
import { LoseCardComponent } from '../components/moves';
import { WinnerScreen, LoadingSpinner, ResponseScreen } from '../components/gameplay';

const PlayerScreen = (props) => {
  const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [move, setMove] = useState('');
  const [currentMove, setCurrentMove] = useState('');
  const [playerChosen, setPlayerChosen] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loseACard, setLoseACard] = useState(false);
  const [ambassadorBluff, setAmbassadorBluff] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('Waiting for others');
  const [outOfGame, setOutOfGame] = useState(false);
  const [winner, setWinner] = useState('');
  const [redirect, setRedirect] = useState(false);

  const { roomName, playerNames, playerNamesMapping } = useContext(RoomContext);
  const { playerData } = usePlayerData(roomName, props.playerID);
  const { roomData } = useRoomData(roomName);

  const totalPlayers = playerNames.length;

  // Check if player is out of game
  useEffect(() => {
    if (playerData && playerData.cards && playerData.cards.length === 0) {
      setOutOfGame(true);
    }
  }, [playerData]);

  // Handle room updates (turn changes, winner)
  useEffect(() => {
    if (!roomData) return;

    if (roomData.winner) {
      setWinner(roomData.winner);
    } else if (roomData.turn !== currentTurn) {
      // Reset state for new turn
      setMove('');
      setCurrentMove('');
      setWaitingMessage('Waiting for others');
      setPlayerChosen('');
      setLoseACard(false);
      setConfirmed(false);

      // Check if it's this player's turn
      setIsTurn(roomData.turn % totalPlayers === props.playerIndex);
      setCurrentTurn(roomData.turn);

      // Register move callback for this turn
      RegisterMoveCallback(
        roomName,
        roomData.turn,
        props.playerID,
        playerNames[props.playerIndex],
        setMove,
        setCurrentMove,
        setConfirmed,
        setWaitingMessage,
        setPlayerChosen,
        setLoseACard,
        setAmbassadorBluff,
        totalPlayers,
        playerNames
      );
    }
  }, [roomData, currentTurn, roomName, props.playerID, props.playerIndex, playerNames, totalPlayers]);

  // Create confirm function for losing a card
  const createConfirmFunction = useCallback(() => {
    return () => {
      incrementTurn(roomName, totalPlayers, playerNames);
    };
  }, [roomName, totalPlayers, playerNames]);

  // Handle redirect
  if (redirect) {
    return <Redirect to="/" />;
  }

  // Show winner screen
  if (winner) {
    return <WinnerScreen winner={winner} onNewGame={() => setRedirect(true)} />;
  }

  // Show out of game screen
  if (outOfGame) {
    return (
      <div>
        <h3>You Lost</h3>
      </div>
    );
  }

  // Handle bluff scenario - player must lose a card
  if (move === 'bluff') {
    return (
      <div>
        <LoseCardComponent
          title={waitingMessage}
          roomName={roomName}
          playerID={props.playerID}
          turn={currentTurn}
          confirmFunction={createConfirmFunction()}
        />
      </div>
    );
  }

  // Player's turn
  if (isTurn) {
    // Waiting for confirmation
    if (confirmed) {
      return <LoadingSpinner message={waitingMessage} />;
    }

    // Handle special moves or responses
    if (currentMove !== '') {
      if (!loseACard) {
        return (
          <div>
            <OtherMoves
              move={currentMove}
              roomName={roomName}
              playerID={props.playerID}
              turn={currentTurn}
              ambassadorBluff={ambassadorBluff}
              totalPlayers={totalPlayers}
              setConfirmed={setConfirmed}
              setWaitingMessage={setWaitingMessage}
              playerNames={playerNames}
            />
          </div>
        );
      } else if (currentMove === 'blocked') {
        return (
          <ResponseScreen
            move={waitingMessage}
            currentMove="blocked"
            currentTurn={currentTurn}
            roomName={roomName}
            playerID={props.playerID}
            playerName={playerNamesMapping[props.playerID]}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      } else {
        return <LoadingSpinner message={waitingMessage} />;
      }
    }

    // Show move list - player can choose a move
    return (
      <div>
        <h3>Make A Move!</h3>
        <MoveList
          currentTurn={currentTurn}
          roomName={roomName}
          activePlayerID={props.playerID}
          playerName={playerNamesMapping[props.playerID]}
          setConfirmed={setConfirmed}
        />
      </div>
    );
  }

  // Not player's turn - waiting or responding
  if (confirmed && playerNames[props.playerIndex] !== playerChosen) {
    return <LoadingSpinner message={waitingMessage} />;
  }

  // Responding to another player's move
  if (move !== '') {
    const isTargeted = playerNames[props.playerIndex] === playerChosen;
    const isSpecialMove =
      currentMove === 'AttemptAssassin' || currentMove === 'Coup' || currentMove === 'Captain';

    if (!isSpecialMove) {
      return (
        <ResponseScreen
          move={move}
          currentMove={currentMove}
          currentTurn={currentTurn}
          roomName={roomName}
          playerID={props.playerID}
          playerName={playerNamesMapping[props.playerID]}
          setConfirmed={setConfirmed}
          setMove={setMove}
        />
      );
    } else {
      // Handle targeted special moves
      if (isTargeted) {
        if (!loseACard) {
          if (
            (currentMove === 'AttemptAssassin' && !confirmed) ||
            (currentMove === 'Captain' && !confirmed)
          ) {
            return (
              <ResponseScreen
                move={move}
                currentMove={currentMove}
                currentTurn={currentTurn}
                roomName={roomName}
                playerID={props.playerID}
                playerName={playerNamesMapping[props.playerID]}
                setConfirmed={setConfirmed}
                setMove={setMove}
              />
            );
          } else if (confirmed) {
            return <LoadingSpinner message="Waiting for player!" />;
          } else {
            return (
              <ResponseScreen
                move={move}
                currentMove={currentMove}
                currentTurn={currentTurn}
                roomName={roomName}
                playerID={props.playerID}
                playerName={playerNamesMapping[props.playerID]}
                setConfirmed={setConfirmed}
                setMove={setMove}
              />
            );
          }
        } else {
          return (
            <div>
              <LoseCardComponent
                title={waitingMessage}
                roomName={roomName}
                turn={currentTurn}
                playerID={props.playerID}
                confirmFunction={createConfirmFunction()}
              />
            </div>
          );
        }
      } else {
        return <LoadingSpinner message={waitingMessage} />;
      }
    }
  }

  // Default - show whose turn it is
  return (
    <div>
      <h3>{playerNames[currentTurn % totalPlayers]}'s Turn</h3>
    </div>
  );
};

export default PlayerScreen;
