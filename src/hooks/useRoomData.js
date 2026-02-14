/**
 * Custom hook for subscribing to room data
 */

import { useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { FIREBASE_ROOT_COLLECTION } from '../constants';

/**
 * Subscribes to room document and returns real-time updates
 * @param {string} roomName - The name of the room to subscribe to
 * @returns {Object} - { roomData, loading, error }
 */
export const useRoomData = (roomName) => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            setRoomData(doc.data());
            setError(null);
          } else {
            setError(new Error(`Room ${roomName} does not exist`));
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [roomName]);

  return { roomData, loading, error };
};
