/**
 * Response screen component - shows appropriate response list based on move type
 */

import React from 'react';
import {
  ResponseList,
  ResponseListForeignAid,
  ResponseListBlock,
  ResponseListAssassin,
  ResponseListDuke,
  ResponseListCaptain,
  ResponseListAmbassador,
} from '../MoveList';

export const ResponseScreen = ({
  move,
  currentMove,
  currentTurn,
  roomName,
  playerID,
  playerName,
  setConfirmed,
  setMove,
}) => {
  const getResponseList = () => {
    switch (currentMove) {
      case 'ForeignAid':
        return (
          <ResponseListForeignAid
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      case 'Duke':
        return (
          <ResponseListDuke
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      case 'Ambassador':
        return (
          <ResponseListAmbassador
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      case 'blocked':
        return (
          <ResponseListBlock
            currentTurn={currentTurn}
            roomName={roomName}
            activePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      case 'AttemptAssassin':
        return (
          <ResponseListAssassin
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      case 'Captain':
        return (
          <ResponseListCaptain
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
      default:
        return (
          <ResponseList
            currentTurn={currentTurn}
            roomName={roomName}
            notActivePlayerID={playerID}
            playerName={playerName}
            setConfirmed={setConfirmed}
            setMove={setMove}
          />
        );
    }
  };

  return (
    <div>
      <h3>{move}</h3>
      {getResponseList()}
    </div>
  );
};
