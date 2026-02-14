/**
 * Loading spinner component
 */

import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from '../../gameplay/AllPlayersScreen.module.scss';

export const LoadingSpinner = ({ message }) => (
  <div>
    <div align="middle" className={styles.spinnerContainer}>
      <Spinner animation="border" as="span" />
    </div>
    <div className="col-xs-6" align="middle">
      {message}
    </div>
  </div>
);
