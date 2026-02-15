/**
 * Custom hook for subscribing to turn data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, TURNS_COLLECTION } from '../constants';
import { Turn } from '../types';

/**
 * Subscribes to turn document and returns real-time updates
 * @param roomName - The name of the room
 * @param turnNumber - The turn number to subscribe to
 * @returns Object with turnData, loading, and error
 */
export const useTurnData = (roomName: string, turnNumber: number) => {
  const [turnData, setTurnData] = useState<Turn | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
            setTurnData(doc.data() as Turn);
            setError(null);
          } else {
            setTurnData(null);
          }
          setLoading(false);
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName, turnNumber]);

  return { turnData, loading, error };
};
