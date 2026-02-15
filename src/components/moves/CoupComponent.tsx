/**
 * Coup move component - allows player to choose target for coup
 */

import React, { useEffect, useState } from 'react';
import { usePlayersCollection } from '../../hooks';
import { updateTurnMove } from '../../api/turnApi';
import { Move } from '../../backend/move_logic';
import styles from './PerformMoves.module.scss';

export const CoupComponent = ({ roomName, playerID, turn, setConfirmed, setWaitingMessage }) => {
  const [playerArray, setPlayerArray] = useState([]);
  const { players, loading } = usePlayersCollection(roomName);

  useEffect(() => {
    if (!loading && players) {
      const eligiblePlayers = players
        .filter(player => player.id !== playerID && player.cards && player.cards.length >= 1)
        .map(player => player.name);
      setPlayerArray(eligiblePlayers);
    }
  }, [players, loading, playerID]);

  const handlePlayerClick = (playerChosen) => async () => {
    try {
      const turnData = await import('../../api/turnApi').then(m => m.getTurnData(roomName, turn));
      const oldMove = turnData.move;
      const newMove = Move(oldMove.type, oldMove.player, playerChosen);
      await updateTurnMove(roomName, turn, newMove);
      setConfirmed(true);
      setWaitingMessage('Waiting for response');
    } catch (error) {
      console.error('Error selecting coup target:', error);
    }
  };

  return (
    <div>
      <h3>Choose a player to Coup!</h3>
      <ul>
        {playerArray.map(player => (
          <div className={styles.buttonContainer} key={player}>
            <button
              type="button"
              className={`btn btn-lg btn-danger ${styles.actionButton}`}
              onClick={handlePlayerClick(player)}
            >
              {player}
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};
