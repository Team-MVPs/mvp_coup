/**
 * Custom hook for subscribing to player data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, PLAYERS_COLLECTION } from '../constants';

/**
 * Subscribes to player document and returns real-time updates
 * @param {string} roomName - The name of the room
 * @param {string} playerID - The ID of the player to subscribe to
 * @returns {Object} - { playerData, loading, error }
 */
export const usePlayerData = (roomName, playerID) => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomName || !playerID) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .doc(playerID)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setPlayerData(doc.data());
            setError(null);
          } else {
            setError(new Error(`Player ${playerID} does not exist`));
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName, playerID]);

  return { playerData, loading, error };
};
