/**
 * Custom hook for subscribing to room data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION } from '../constants';
import { Room } from '../types';

/**
 * Subscribes to room document and returns real-time updates
 * @param roomName - The name of the room to subscribe to
 * @returns Object with roomData, loading, and error
 */
export const useRoomData = (roomName: string) => {
  const [roomData, setRoomData] = useState<Room | null>(null);
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
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            setRoomData(doc.data() as Room);
            setError(null);
          } else {
            setError(new Error(`Room ${roomName} does not exist`));
          }
          setLoading(false);
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName]);

  return { roomData, loading, error };
};
