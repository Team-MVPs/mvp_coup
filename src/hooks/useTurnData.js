/**
 * Custom hook for subscribing to turn data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, TURNS_COLLECTION } from '../constants';

/**
 * Subscribes to turn document and returns real-time updates
 * @param {string} roomName - The name of the room
 * @param {number} turnNumber - The turn number to subscribe to
 * @returns {Object} - { turnData, loading, error }
 */
export const useTurnData = (roomName, turnNumber) => {
  const [turnData, setTurnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomName || turnNumber === null || turnNumber === undefined || turnNumber < 0) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(TURNS_COLLECTION)
      .doc(turnNumber.toString())
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setTurnData(doc.data());
            setError(null);
          } else {
            setTurnData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName, turnNumber]);

  return { turnData, loading, error };
};
