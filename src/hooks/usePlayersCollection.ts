/**
 * Custom hook for subscribing to all players in a room
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION, PLAYERS_COLLECTION } from '../constants';
import { Player } from '../types';

export interface PlayerWithId extends Player {
  id: string;
}

/**
 * Subscribes to players collection and returns real-time updates
 * @param roomName - The name of the room
 * @returns Object with players array, loading, and error
 */
export const usePlayersCollection = (roomName: string) => {
  const [players, setPlayers] = useState<PlayerWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomName) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore
      .collection(FIREBASE_ROOT_COLLECTION)
      .doc(roomName)
      .collection(PLAYERS_COLLECTION)
      .onSnapshot(
        (snapshot) => {
          const playersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as PlayerWithId));
          setPlayers(playersList);
          setError(null);
          setLoading(false);
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName]);

  return { players, loading, error };
};
