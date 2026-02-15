/**
 * Custom hook for subscribing to player data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, PLAYERS_COLLECTION } from '../constants';
import { Player } from '../types';

/**
 * Subscribes to player document and returns real-time updates
 * @param roomName - The name of the room
 * @param playerID - The ID of the player to subscribe to
 * @returns Object with playerData, loading, and error
 */
export const usePlayerData = (roomName: string, playerID: string) => {
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
            setPlayerData(doc.data() as Player);
            setError(null);
          } else {
            setError(new Error(`Player ${playerID} does not exist`));
          }
          setLoading(false);
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName, playerID]);

  return { playerData, loading, error };
};
