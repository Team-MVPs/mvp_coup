/**
 * Winner screen component
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../gameplay/AllPlayersScreen.module.scss';

export const WinnerScreen = ({ winner, onNewGame }) => (
  <div>
    <h3>{winner} is the winner!</h3>
    <p className={styles.thankYouMessage}>Thanks for playing MVP Coup!</p>
    <div className={styles.buttonContainer}>
      <Button
        type="button"
        className={`btn btn-lg btn-light ${styles.newGameButton}`}
        onClick={onNewGame}
      >
        New Game
      </Button>
    </div>
  </div>
);
